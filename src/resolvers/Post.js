const Post = {
  author(parent, args, { db, prisma }, info) {
    const { authorId } = parent;
    return prisma.user.findUnique({
      where:{
        id:authorId
      }
    })
    
    // // return db.users.find((user) => {
    //   return user.id === authorId;
    // });
  },
  //Post comments field resolver function==> returns all the comments associated with a given post
  comments(parent, args, { db }, info) {
    const { id } = parent;
    return db.comments.filter((comment) => {
      return comment.postId === id;
    });
  },
};
export default Post;
