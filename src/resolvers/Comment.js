const Comment = {
  author(parent, args, { db }, info) {
    // since parent = Comment object because that is the calling resolver
    const { authorId } = parent;
    return db.users.find((user) => {
      return user.id === authorId;
    });
  },
  //returns the post object for a given comment
  post(parent, args, { db }, info) {
    // since parent = Comment object because that is the calling resolver
    const { postId } = parent;
    return db.posts.find((post) => {
      return post.id === postId;
    });
  },
};
export default Comment;
