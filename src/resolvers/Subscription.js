const Subscription = {
  countSub: {
    subscribe(parent, args, { pubsub, prisma }, info) {
      let count = 0;
      setInterval(() => {
        count++;
        pubsub.publish("countChanel", { countSub: count });
      }, 1000);
      //this sets up the open communication channel between server and client
      return pubsub.asyncIterator("countChanel");
    },
  },
  //setting up the subscription channel
  commentSub: {
    async subscribe(parent, { postId }, { pubsub, db, prisma }, info) {
      const existingPost = await prisma.post.count({
        where: {
          id: postId,
        },
      });
      console.log(existingPost, "update post");
      if (existingPost === 0) {
        //stops the execution, returns the thrown error
        throw new Error("Post not found");
      }

      // const post = db.posts.find((post) => post.id === postId);
      // if (!post) {
      //   throw new Error("Post not Found");
      // }
      return pubsub.asyncIterator(`comment for ${postId}`);
    },
  },
  //setting up the subscription channel
  postSub: {
    subscribe: (parent, args, { pubsub }, info) => pubsub.asyncIterator("post"),
  },
};
export default Subscription;
