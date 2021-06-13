//step 1 ==> import graph ql server
import { GraphQLServer } from "graphql-yoga";
import { users, posts } from "./models/dummy-data";

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

    WORKING WITH RELATIONAL TYPES
    these are custom types that are added as fields to other custom type definitions to show relations between those custom types. for e.g
    
    For our blogging app
    we have Users, Posts and Comments tables but the data stored in all these tables are related to one another. how?
    1. a post must have an author(user) on the posts table
    2. a user can have many posts on the users table
    3. a user can have many comments
    4. a post can have many comments
    5. a comment can only belong to one post
    6. a comment can only belong to a single user

    how then do we teach our API to handle these type of relationships ==> by using relational types
    HOW DO WE DEFINE RELATIONAL TYPES
    using our list above
    for 1, 
      a. we would add a field to the Post custom type that will return the User custom type where we defined  the post schema in the type Defs as shown below

        type Post{
            id:ID!
            title:String!
            body:String!
            published:Boolean!
            author: User!

        }
     
      b. Define a custom type resolver for it. using the above e.g we have Post author() resolver, which will be defined in the Post property in the resolver object

      recall that in our Posts table, we are only saving the authorId, this means that for each post, we would have to find a matching author in users table by matching authorId to the user's Id. 

          how do we do this?
            we define a custom resolver function to handle it at the root of the resolver object

            const resolver = {
              Query:{},
              /*
                customTypeName:{
                  //create a resolver method for each relational type field and since we have just author
                  relationalTypeName(){

                  }
                }
               
            */

/*
              //define this at the root of the resolver object
              Post:{
                author(parents,args,ctx,info){
                    //what the function should return, which in our case is user object whose id is matching the post's authorId
                }
              }
            }

      c. how does this help us get the user object from the users table for each post?
            first off, graph ql runs the query resolver method for the posts query to retrieve all the posts, then for each post, it runs the author resolver method defined in the Post to get the user object that is equal to the authorId in the Post table

            each post object is stored in the parents argument that the author resolver gets called with

       d. this means that for the posts or post query, when we are returning the Post custom type, we will return it together with the User custom type
          type Query { 
            post: Post!
            posts(query:String):[Post!]!
            
          }


    for 2
            a. we would add a field to the User custom type that will return an array of Post custom type. where we defined the user schema in the type Defs as shown below

            type User {
                id: ID!
                name: String!
                email: String!
                age: Int
                posts: [Post!]!
            }
        
        b. Define a custom type resolver for it. using the above e.g we have User posts() resolver, which will be defined in the User property in the resolver object
        
        recall that in our User-Post table, we are only saving the authorId against the postId (a user can have many posts ==> [Post!]!), this means that for each user, we can filter the posts array to find all the posts they authored. 
            how do we do this?
                we define a custom resolver function to handle it at the root of the resolver object

                const resolver = {
                    Query:{},
                /*
                    customTypeName:{
                    //create a resolver method for each relational type field and since we have just author
                    relationalTypeName(){

                    }
                }
                
                */

/*
                    //define this at the root of the resolver object
                    //recall that User will match the custom type name
                    User:{
                        posts(parent,args,ctx,info){
                            //parent is equal to the current user object
                            //what the function should return, which in our case is an array of post objects whose authorId is matching the user's Id
                        }
                    }
                }

        c. how does this help us get the posts object array from the posts table for each user?
                first off, graph ql runs the query resolver method for the users query to retrieve all the users, 
                
                then it checks to see if there is any relational type definition in the schema definition and if none, it will return the value from the query resolver function
                
                if yes, it will check for which field is the relational type defined, in our case it is the posts field. 
                
                then for each user object, it will run the "posts" resolver method defined in the User to get the all the posts objects where post.authorId === user.id 

                each user object is stored in the parents argument that the posts resolver gets called with
        d. this means that for the users or user query, when we are returning the User custom type, we will return it together with the array of Posts custom type
            type Query { 
                user: User!
                users(query:String):[User!]!
                
            }

            SUMMARY
            for a resolver method that handles operations such as Query, it returns an object that matches up in type definition.
            for e.g user:User! ==> user query must return a user object.
            this means that the resolver that will handle user query must return an object that contains all the fields defined in the User type def by matching the field names

            for scalar fields this is easy because it just matches the field name and returns the value associated with it as the value for the field defined in type defs
            e.g User type def
            type User {
                id: ID!
                name: String!
                email: String!
                age: Int
                posts: [Post!]!
            }

            for scalar fields(fields where the value data type is scalar) i.e id, name, email, age, the resolver must return an object that contains these fields as property names and then assigns what ever value to the corresponding field names.
            e.g value for id is matched or assigned to id in type defs

            for relational fields(fields that have custom type as values) i.e posts that have relational values, the resolver function goes off to find the custom type resolver function to learn how to handle this type of field. hence it finds User posts method



*/

const typeDefs = `
    type Query {
        person: User!
        post: Post!
        users(query: String):[User!]!
        posts(query:String):[Post!]!
        
        
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
    person() {
      return {
        id: "abc123",
        name: "Mike",
        email: "mike@example.com",
        age: 23,
      };
    },
    users(parents, args, ctx, info) {
      const { query } = args;
      if (!query) {
        return users;
      }
      return users.filter((user) => {
        return user.name
          .toLocaleLowerCase()
          .includes(query.toLocaleLowerCase());
      });
    },
    posts(parents, args, ctx, info) {
      const { query } = args;
      if (!query) {
        return posts;
      }
      return posts.filter((post) => {
        return (
          post.title.toLocaleLowerCase().includes(query.toLocaleLowerCase()) ||
          post.body.toLocaleLowerCase().includes(query.toLocaleLowerCase())
        );
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
