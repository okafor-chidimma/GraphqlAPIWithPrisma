import { GraphQLServer, PubSub } from "graphql-yoga";
import { PrismaClient } from "@prisma/client";

import db from "./db";
import Query from "./resolvers/Query";
import Mutation from "./resolvers/Mutation";
import Subscription from "./resolvers/Subscription";
//import User from "./resolvers/User";
// import Comment from "./resolvers/Comment";
// import Post from "./resolvers/Post";

const pubsub = new PubSub();
const prisma = new PrismaClient({ log: ["query"] });

// typeDefs path is relative to the root if the application
const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers: {
    Query,
    Mutation,
    Subscription,
  },
  context: {
    db: db,
    // you can use shorthand syntax
    pubsub,
    prisma,
  },
});
const options = {
  port: 8000,
  endpoint: "/graphql",
  subscriptions: "/subscriptions",
  //opens the graphql playground
  playground: "/playground",
};

server.start(options, ({ port }) =>
  console.log(
    `Server started, listening on port ${port} for incoming requests.`
  )
);
/*
    without options parameter
    server.start(() =>
      console.log(
        "Server is Up"
      )
    );

*/

//there are 4 args that gets passed into each resolver function by default
/*
  1. parent ==> this is the current custom object that the resolver is defined in. for e.g for User posts resolver method, parent is set to the current User object
  2. args ==> this is the object that contains all the arguments passed into an operation whether it is a query or mutation
  3. ctx ==> this is the global object which contains everything that you would like all resolvers to have access to. the values are set as key:value pairs and it is configured when you are creating the server
  4. info

*/
