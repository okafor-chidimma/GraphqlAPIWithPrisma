import { v4 as uuidv4 } from "uuid";
const Mutation = {
  async createUser(parent, { data }, { db, prisma }, info) {
    //loops through the array to ensure that the email is not in use
    // const isEmailTaken = db.users.some((user) => {
    //   return user.email === args.user.email;
    // });
    // if (isEmailTaken) {
    //   //stops the execution, returns the thrown error
    //   throw new Error("Email is Taken. Use another email");
    // }

    // const user = {
    //   id: uuidv4(),
    //   ...args.user,
    // };
    const existingUser = await prisma.user.count({
      where: {
        email: data.email,
      },
    });
    console.log(existingUser);
    if (existingUser > 0) {
      //stops the execution, returns the thrown error
      throw new Error("Email is Taken. Use another email");
    }
    //by default, the resolvers must wait for the promises to resolve before returning the data, so awaiting it is just tautology. you can just directly return the promise

    //prisma methods return promises
    // const newUser = await prisma.user.create({
    //   data,
    // });
    // return newUser;

    //only use await when you need to use the returned value within the resolver
    return prisma.user.create({
      data,
    });
  },
  async updateUser(parent, args, { db, prisma }, info) {
    const { id, data } = args;
    const existingUser = await prisma.user.count({
      where: {
        id,
      },
    });
    console.log(existingUser, "update user");
    if (existingUser === 0) {
      //stops the execution, returns the thrown error
      throw new Error("User not found");
    }
    //without the above check, prisma just throws a generic error that the user may not understand. we put the check there in other to customize our error message
    return prisma.user.update({
      where: {
        id,
      },
      data,
      include: {
        posts: true,
        comments: true,
      },
    });
    // const user = db.users.find((user) => user.id === id);

    // if (!user) {
    //   throw new Error("User not found");
    // }

    // if (typeof data.email === "string") {
    //   const emailTaken = db.users.some((user) => user.email === data.email);

    //   if (emailTaken) {
    //     throw new Error("Email taken");
    //   }

    //   user.email = data.email;
    // }

    // if (typeof data.name === "string") {
    //   user.name = data.name;
    // }

    // if (typeof data.age !== "undefined") {
    //   user.age = data.age;
    // }

    // return user;
  },
  async deleteUser(parent, args, { db, prisma }, info) {
    const existingUser = await prisma.user.count({
      where: {
        id: args.id,
      },
    });
    console.log(existingUser);
    if (existingUser === 0) {
      //stops the execution, returns the thrown error
      throw new Error("User not found");
    }
    return await prisma.user.delete({
      where: { id: args.id },
      include: {
        posts: true,
        comments: true,
      },
    });
    // const userIndex = db.users.findIndex((user) => user.id === args.id);

    // if (userIndex === -1) {
    //   throw new Error("User not found");
    // }

    // const deletedUsers = db.users.splice(userIndex, 1);

    // db.posts = db.posts.filter((post) => {
    //   const match = post.authorId === args.id;

    //   if (match) {
    //     db.comments = db.comments.filter(
    //       (comment) => comment.postId !== post.id
    //     );
    //   }

    //   return !match;
    // });
    // db.comments = db.comments.filter((comment) => comment.authorId !== args.id);

    // return deletedUsers[0];
  },

  async createPost(parent, args, { db, pubsub, prisma }, info) {
    // const doesUserExist = db.users.some(
    //   (user) => user.id === args.post.authorId
    // );
    // if (!doesUserExist) {
    //   throw new Error("User Does Not Exist");
    // }
    // const post = {
    //   id: uuidv4(),
    //   ...args.post,
    // };

    // db.posts.push(post);
    // if (post.published) {
    //   //publishing new data to channel
    //   pubsub.publish("post", {
    //     postSub: {
    //       mutation: "CREATED",
    //       postData: post,
    //     },
    //   });
    // }

    const existingUser = await prisma.user.count({
      where: {
        id: args.post.authorId,
      },
    });
    console.log(existingUser, "create post");
    if (existingUser === 0) {
      //stops the execution, returns the thrown error
      throw new Error("Cannot Create Post, User not found");
    }

    /*
        the post object we are returning is the same as the post object we declared as the return type of the mutation.

        so this resolver matches each property and returns the value when asked for from the client
        however, we cannot request for authorId since we did not define it when we were declaring the type in type defs but we can get author since it is defined in the type defs

        when getting author, the resolver will check if this post object defined here has author
        if yes, it will return the value else it goes off to run the resolver function for author in Post customer type, whatever is returned from there becomes the value returned when author property is queried
      
      */
    const createdPost = await prisma.post.create({
      data: args.post,
      include: {
        author: true,
      },
    });
    if (createdPost.published) {
      //publishing new data to channel
      pubsub.publish("post", {
        postSub: {
          mutation: "CREATED",
          postData: createdPost,
        },
      });
    }
    return createdPost;
  },
  async updatePost(parent, args, { db, pubsub, prisma }, info) {
    const { id, data } = args;
    const existingPost = await prisma.post.count({
      where: {
        id,
      },
    });
    console.log(existingPost, "update post");
    if (existingPost === 0) {
      //stops the execution, returns the thrown error
      throw new Error("Post not found");
    }
    //without the above check, prisma just throws a generic error that the user may not understand. we put the check there in other to customize our error message
    return prisma.post.update({
      where: {
        id,
      },
      data,
      include: {
        author: true,
        comments: true,
      },
    });

    // const { id, data } = args;
    // const post = db.posts.find((post) => post.id === id);
    // const originalPost = { ...post };

    // if (!post) {
    //   throw new Error("Post not found");
    // }

    // if (typeof data.title === "string") {
    //   post.title = data.title;
    // }

    // if (typeof data.body === "string") {
    //   post.body = data.body;
    // }

    // if (typeof data.published === "boolean") {
    //   post.published = data.published;
    //   //if the post was published before and later became unpublished even if it was not deleted
    //   if (originalPost.published && !post.published) {
    //     pubsub.publish("post", {
    //       postSub: {
    //         mutation: "DELETED",
    //         postData: originalPost,
    //       },
    //     });
    //   }
    //   //if the post was not published before and updated to published
    //   else if (!originalPost.published && post.published) {
    //     pubsub.publish("post", {
    //       postSub: {
    //         mutation: "CREATED",
    //         postData: post,
    //       },
    //     });
    //   }
    // } else if (post.published) {
    //   pubsub.publish("post", {
    //     postSub: {
    //       mutation: "UPDATED",
    //       postData: post,
    //     },
    //   });
    // }

    // return post;
  },
  async deletePost(parent, args, { db, pubsub, prisma }, info) {
    const existingPost = await prisma.post.count({
      where: {
        id: args.id,
      },
    });
    console.log(existingPost);
    if (existingPost === 0) {
      //stops the execution, returns the thrown error
      throw new Error("Post not found");
    }
    const deletedPost = await prisma.post.delete({
      where: { id: args.id },
      include: {
        author: true,
        comments: true,
      },
    });
    if (deletedPost.published) {
      //publishing new data to channel
      pubsub.publish("post", {
        postSub: {
          mutation: "DELETED",
          postData: deletedPost,
        },
      });
    }

    return deletedPost;

    // const postIndex = db.posts.findIndex((post) => post.id === args.id);
    // console.log(postIndex);
    // if (postIndex === -1) {
    //   throw new Error("Post not found");
    // }

    // const [deletedPost] = db.posts.splice(postIndex, 1);
    // console.log(deletedPost);
    // console.log(args);

    // db.comments = db.comments.filter((comment) => {
    //   console.log(comment);
    //   return comment.postId !== args.id;
    // });
    // if (deletedPost.published) {
    //   //publishing new data to channel
    //   pubsub.publish("post", {
    //     postSub: {
    //       mutation: "DELETED",
    //       postData: deletedPost,
    //     },
    //   });
    // }
    // console.log(db.comments);
    // return deletedPost;
  },

  async createComment(parent, args, { db, pubsub, prisma }, info) {
    const { text, authorId, postId } = args.comment;
    const existingUser = await prisma.user.count({
      where: {
        id: authorId,
      },
    });
    const existingPost = await prisma.post.count({
      where: {
        id: postId,
      },
    });
    console.log(existingUser, "create comment");
    if (existingUser === 0 || existingPost == 0) {
      //stops the execution, returns the thrown error
      throw new Error("Cannot Create Create, User and Post not found");
    }
    const newComment = await prisma.comment.create({
      data: { text, authorId, postId },
      include: {
        post: {
          include: {
            author: true,
          },
        },
        author: true,
      },
    });
    // //publishing new data to channel
    pubsub.publish(`comment for ${postId}`, {
      commentSub: {
        mutation: "CREATED",
        commentData: newComment,
      },
    });
    return newComment;

    // const doesUserExist = db.users.some((user) => user.id === authorId);

    // const doesPostExist = db.posts.some(
    //   (post) => post.id === postId && post.published === true
    // );
    // if (!doesPostExist || !doesUserExist) {
    //   throw new Error("Unable to find user and post");
    // }
    // const comment = {
    //   id: uuidv4(),
    //   text,
    //   authorId,
    //   postId,
    // };

    // db.comments.push(comment);
    // //publishing new data to channel
    // pubsub.publish(`comment for ${postId}`, {
    //   commentSub: {
    //     mutation: "CREATED",
    //     commentData: comment,
    //   },
    // });
    // return comment;
  },
  async updateComment(parent, args, { db, pubsub, prisma }, info) {
    const { id, data } = args;
    const existingComment = await prisma.comment.count({
      where: {
        id,
      },
    });
    console.log(existingComment, "update comment");
    if (existingComment === 0) {
      //stops the execution, returns the thrown error
      throw new Error("Comment not found");
    }
    //without the above check, prisma just throws a generic error that the user may not understand. we put the check there in other to customize our error message
    const updatedComment = await prisma.comment.update({
      where: {
        id,
      },
      data,
      include: {
        author: true,
        post: {
          include: {
            author: true,
          },
        },
      },
    });
    console.log(updatedComment.postId, updatedComment);
    pubsub.publish(`comment for ${updatedComment.postId}`, {
      commentSub: {
        mutation: "UPDATED",
        commentData: updatedComment,
      },
    });
    console.log(updatedComment.postId, updatedComment);
    return updatedComment;
    // }
    // const { id, data } = args;
    // const comment = db.comments.find((comment) => comment.id === id);

    // if (!comment) {
    //   throw new Error("Comment not found");
    // }

    // if (typeof data.text === "string") {
    //   comment.text = data.text;
    //   //publishing new data to channel
    //   pubsub.publish(`comment for ${comment.postId}`, {
    //     commentSub: {
    //       mutation: "UPDATED",
    //       commentData: comment,
    //     },
    //   });
    // }

    // return comment;
  },
  async deleteComment(parent, args, { prisma, db, pubsub }, info) {
    const existingComment = await prisma.comment.count({
      where: {
        id: args.id,
      },
    });
    console.log(existingComment, "delete comment");
    if (existingComment === 0) {
      //stops the execution, returns the thrown error
      throw new Error("Comment not found");
    }
    const deletedComment = await prisma.comment.delete({
      where: { id: args.id },
      include: {
        author: true,
        post: {
          include: {
            author: true,
          },
        },
      },
    });
    pubsub.publish(`comment for ${deletedComment.postId}`, {
      commentSub: {
        mutation: "DELETED",
        commentData: deletedComment,
      },
    });
    return deletedComment;
    // const commentIndex = db.comments.findIndex(
    //   (comment) => comment.id === args.id
    // );

    // if (commentIndex === -1) {
    //   throw new Error("Comment not found");
    // }

    // const [deletedComment] = db.comments.splice(commentIndex, 1);
    // //publishing new data to channel
    // pubsub.publish(`comment for ${comment.postId}`, {
    //   commentSub: {
    //     mutation: "DELETED",
    //     commentData: deletedComment,
    //   },
    // });

    // return deletedComment;
  },
};
export default Mutation;
