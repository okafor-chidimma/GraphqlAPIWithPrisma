const User = {
  // User posts field resolver function
  posts(parent, args, { db, prisma }, info) {
    console.log(parent, "parent");
    const { id } = parent; //parent is the user object
    return prisma.post.findMany({
      where: {
        authorId: id,
      },
    });
    // return db.posts.filter((post) => {
    //   return post.authorId === id;
    // });
  },
  //User comments field resolver function
  comments(parent, args, { db, prisma }, info) {
    const { id } = parent; //parent is the current user object
    return prisma.comment.findMany({
      where: {
        authorId: id,
      },
    });
    // return db.comments.filter((comment) => {
    //   return comment.authorId === id;
    // });
  },
};

export default User;
