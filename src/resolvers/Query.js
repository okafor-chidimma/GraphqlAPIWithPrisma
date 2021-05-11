const Query = {
  person() {
    return {
      id: "abc123",
      name: "Mike",
      email: "mike@example.com",
      age: 23,
    };
  },
  comments(parent, args, { db, prisma }, info) {
    //return db.comments;
    return prisma.comment.findMany({
      include: { author: true, post: { include: { author: true } } },
    });
  },
  post() {
    return {
      id: "YER2343",
      title: "GraphQl Course",
      body: "Amazing",
      published: false,
    };
  },
  async posts(parent, args, { db, prisma }, info) {
    const { query = "" } = args;
    // if (!query) {
    //   return db.posts;
    // }
    // return db.posts.filter((post) => {
    //   return (
    //     post.title.toLocaleLowerCase().includes(query.toLocaleLowerCase()) ||
    //     post.body.toLocaleLowerCase().includes(query.toLocaleLowerCase())
    //   );
    // });

    return prisma.post.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            body: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      include: {
        author: true,
        comments: {
          include: {
            post: true,
            author: true,
          },
        },
      },
    });
    //i need to declare the Post author resolver function for this to return the author property on the post object
  },
  async users(parent, args, { db, prisma }, info) {
    //console.log(info);
    const { query = "" } = args;
    // if (!query) {
    //   return db.users;
    // }
    // return db.users.filter((user) => {
    //   return user.name.toLocaleLowerCase().includes(query.toLocaleLowerCase());
    // });
    console.log(query, "query");
    return prisma.user.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      include: { posts: true, comments: true },
    });
  },
  async user(parent, { id }, { prisma }, info) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      include: { posts: true, comments: true },
    });
    if (!user) {
      throw new Error("User does not exist");
    }
    return user;
  },
};
export default Query;
