/*
    POST SCHEMA or POST MODEL
    type Post{
        //fieldName: return type
        id:ID!
        title:String!
        body:String!
        published:Boolean!
        author: User!//relation field

    }

    POST QUERY
    type Query{
        post: Post!
    }

    POST QUERY RESOLVER
    Query:{
        post(){
            return posts[0];
        }
    }

    POST DATA STORED IN DB OR STORAGE
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

    EXPLANATION
    a. when the Query post resolver is defined, it is defined to return a post object
    b. this returned post object must match the field names and their return types defined in Post schema since that is what we wrote that our post query will return
     for e.g 
     {
        id: "POST3",
        title: "Sweet Mother",
        body: "Song",
        published: true,
        authorId: "123DDB2",
     },

     MUST MATCH field for field and return type for the value
     {
        id:ID!
        title:String!
        body:String!
        published:Boolean!
        author: User!

    }

    c. for scalar fields it is easy because, the return type and name match. for e.g id and its value matches the id and return type defined in the schema, so it is returned. 
    However, the same cannot be said for our relation field because 
        i. the field names do not match (author does not match authorId) and their return types do not match as well.(author has return type of User object while authorId has a string value)
        ii. in this kind of scenario, where you have fields or return types that do not match, the Query post resolver, checks if a custom resolver has been defined for such field. in our case (Post author resolver). this is defined as so because author is a field defined in Post schema
        iii Just like our resolvers, this custom resolver must match the return type(User object) already specified and if it does not, an error is thrown
        iv. In case of a scenario where the Query resolver returns an array, for each object, this custom resolver is ran and the corresponding object saved on each object on the array
        v. as an e.g
        Post:{
            author(parent){
                //parent is passed down from the query resolver and it is equal to each individual object and since it is the custom Post resolver, 
                //parent = post

                //return a User object just as we have specified in the schema definition
            }
        }

*/
