//step 1
import { GraphQLServer } from "graphql-yoga";

//step 2

//type definitions
/*
    here we define the type of operation as well as the data structures application schema(table name and their discreet fields and their relational fields)

    SYNTAX
    1. create a typeDefs template string
    2. specify the type of operation(e.g Query, Mutation etc) and assign it to an object
    3. inside the type operation object, declare your schema(table name) and the data type it should return
    in our case, for hello ==> we want to return string

    PS: if you append an exclamation mark at the end of your data type,
 this means that that particular field is required

*/

const typeDefs = `
    type Query {
        id: ID!
        title:String!
        price:Float!
        releaseYear:Int
        rating:Float
        inStock:Boolean!
    }
`;

//step 3

//resolvers
/*
    these are function definitions that run for each operation that can be performed on our API

    since i have defined 4 query operations, I would have 4 resolver functions

    SYNTAX
    1. declare a resolvers object
    2. define the operation
    3. specify the resolvers for each schema. make sure that the function name matches the schema name
    4. for each function return the expected value which of the specified data type
*/
const resolvers = {
  Query: {
    id() {
      return "SE231RR"; //resolver for hello schema
    },
    title() {
      return "Andrew Mead's Udemy Course";
    },
    price() {
      return 13.99;
    },
    releaseYear() {
      return 2008;
    },
    rating() {
      return null; //since it is optional
    },
    inStock() {
      return true;
    },
  },
};

//step 4 ==> create a new instance of graph ql server, passing in the typeDefs and resolvers we have defined using es6 object property short form

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

//step 5 ==> start the server
//by default the server is on localhost:4000 ==> which opens up a new instance of graphql play ground so we test out our operations

server.start(() => {
  console.log("Server is up");
});
