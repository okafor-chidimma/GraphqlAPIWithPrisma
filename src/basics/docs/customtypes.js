//step 1
import { GraphQLServer } from "graphql-yoga";

//step 2

//type definitions
/*
    here we define the type of operation as well as the data structures application schema(table name and their discreet fields and their relational fields)

    SYNTAX FOR TYPE DEFINITIONS
    1. create a typeDefs template string
    2. required for you to specify the type of operation(e.g Query, Mutation etc) and assign it to an object
        i. inside the type operation object, declare your queries incase the type of operation is Query or mutations incase of mutation operation type and the data type it should return
            a. how do we declare queries inside of the Query type object
                following this format: 
                name of query: data type it should return (can either be scalar or custom type)
    3. Incase you have custom types, for instance, a table with some fields, you define it in the typeDefs under a different type as shown below
        const typeDefs = `
            type Query{
                query_name:data type
            }

            type User {
                id:ID!
                name:String!
                age:Int
            }
        `

        here User, is my custom data type. ALways start the definition with capital letter


    PS: if you append an exclamation mark at the end of your data type, this means that that particular field is required and must be part of the return values in the resolver function

    WORKING WITH OPERATIONS ARGUMENT LIST IN TYPE DEFS
    We can decide to pass in operations arguments list to the query, so that the client can pass in data when calling the query. we do this when we want to send data from the client to the server

    How can we define these argument lists?
    queryName(argName: dataType!, argName: dataType): returning dataType. Remember any one with exclamation means that it is compulsory. i.e it is a required argument
    
    for e.g

    Query{
      greeting(name: String!, position: String, age:Int!): String!
    }

    WORKING WITH ARRAYS IN TYPE DEFS
    1.as return data types: 
      i. when it is an array of scalar types. e.g
          grades: [Int!]! ==> this means that grades resolver function must return an array of integers. it must also return an array even if it is an empty one. as for the contents of the array, if there is ever going to be an element inside of the array then it must be of int data type

      ii. when it is an array of custom types e.g
          users: [User!]! ==> which means that the resolver function must return an array of users, or an empty array if there are no users but as long as the array has an element it must be of user type

          users(query: String): [User!]! ==> this means that for our users query, the client can send in a query string which the resolver can use via its args object to perform an operation

    2. as operations argument list
      i. when it is an array of scalar types. format
          queryName(argName:arg data type ==>[inner arg type]): return data type
          e.g
          multiply(numbers:[Float!]!): Int!;

      ii. when 

*/

const typeDefs = `
    type Query {
        person: User!
        post: Post!
        add(a: Float!, b: Float!): Float!
        age: Int
        grades: [Int!]!
        greeting(name:String!, age:Int): String!
        multiply(numbers: [Float!]!): Int!
        
    }
    
    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Post{
        id:ID!
        title:String!
        body:String!
        published:Boolean!

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
    3. specify the resolvers for each (operation name) query name. make sure that the function name matches the query name
    4. for each function return the expected value which of the specified data type


    the resolver gets called with 4 arguments
    1. parent ==> which deals with relationships between types
    2. args ==> which is an obj containing all the arguments passed in to the query names when they are called from the client(e.g graphQl play ground)
    3. ctx ==> context
    4.info ==> which gives information about the query
*/
const resolvers = {
  Query: {
    age() {
      return 20 || null;
    },
    multiply(parents, args, ctx, info) {
      const { numbers } = args;
      //numbers is an array because that is the datatype I defined as my argument list
      return numbers.reduce((acc, curr) => {
        return acc * curr;
      });
    },
    grades(parents, args, ctx, info) {
      //returning an array because that is the data type i defined in my query
      return [12, 4, 39];
    },
    person() {
      return {
        id: "abc123",
        name: "Mike",
        email: "mike@example.com",
        age: 23,
      };
    },
    add(parents, args) {
      const { a, b } = args;
      return a + b;
    },
    // because I have defined the greeting query to accept args, those arguments are in the args object
    //i have used destructuring and also assigned a default value to age since I did not make it required
    greeting(parents, args) {
      const { name, age = 10 } = args;
      return `Hello ${name} who is ${age} years old. Welcome!!`;
    },
    post() {
      return {
        id: "YER2343",
        title: "GraphQl Course",
        body: "Amazing",
        published: false,
      };
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
