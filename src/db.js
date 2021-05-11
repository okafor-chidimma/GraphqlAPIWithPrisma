const users = [
  {
    id: "123DDB1",
    name: "Mike Peters",
    email: "mike@example.com",
    age: 23,
  },
  {
    id: "123DDB2",
    name: "Susan Adams",
    email: "susan@example.com",
  },
  {
    id: "123DDB3",
    name: "Testimony Philips",
    email: "test@example.com",
  },
];
const posts = [
  {
    id: "POST1",
    title: "Half Of A Yellow Sun",
    body: "Novel",
    published: true,
    authorId: "123DDB2",
  },
  {
    id: "POST2",
    title: "Christmas Nanny",
    body: "Movie",
    published: false,
    authorId: "123DDB1",
  },
  {
    id: "POST3",
    title: "Sweet Mother",
    body: "Song",
    published: true,
    authorId: "123DDB2",
  },
];

const comments = [
  {
    id: "COMMENT1",
    text: "First Comment",
    authorId: "123DDB1",
    postId: "POST3",
  },
  {
    id: "COMMENT2",
    text: "Second Comment",
    authorId: "123DDB2",
    postId: "POST2",
  },
  {
    id: "COMMENT3",
    text: "third Comment",
    authorId: "123DDB1",
    postId: "POST3",
  },
  {
    id: "COMMENT4",
    text: "fourth Comment",
    authorId: "123DDB3",
    postId: "POST1",
  },
];

const db = {
  users,
  comments,
  posts,
};

export default db;
