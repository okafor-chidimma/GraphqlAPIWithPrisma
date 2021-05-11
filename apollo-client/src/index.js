import ApolloBoost, { gql } from "apollo-boost";

const client = new ApolloBoost({
  uri: "http://localhost:8000/graphql",
});

//define the operation
const getUsers = gql`
  query {
    users {
      id
      name
      email
    }
  }
`;
//send off the request to the server
client
  .query({
    query: getUsers,
  })
  .then((response) => {
    console.log(response.data, "response array");
    let html = "";
    response.data.users.forEach((user) => {
      html += `
            <div>
                <h3>${user.name} has this email: ${user.email}</h3>
            </div>
        `;
    });
    document.querySelector("#users").innerHTML = html;
  });
const getPosts = gql`
  query {
    posts {
      title
      author {
        name
      }
    }
  }
`;
client.query({ query: getPosts }).then((response) => {
  let html = "";
  response.data.posts.forEach((post) => {
    html += `
        <div>
            <h3>${post.title} has this author: ${post.author.name}</h3>
        </div>
    `;
  });
  document.querySelector("#posts").innerHTML = html;
});
