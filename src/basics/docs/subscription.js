/*
    Query ==> allows you to fetch data from the db at a particular time and if this data changes after fetching, the one already fetched does not change unless we initiate the fetch query request again

    Mutation ==> allows us to change data

    Subscription ==> allows us to subscribe to data changes. for this to happen, you must initiate a subscription request from the client. this initiation opens up a channel and causes the client to listen for changes and the server only publishes when a change is made to the data.
    it does not fetched data that has already been stored in the db

    HOW DO WE SET UP A SUBSCRIPTION
    import pubsub named export
    create a new pubsub object instance
    pass it through the context to the resolver methods where you want to use it

    define you subscription schema
    type Subscription{
        countSub: Int!
    }

    defined your resolver object for Subscription

    const Subscription = {
        //nameOfSubscription schema but instead of a method, it is going to be an object. inside this object, you setup your subscription by defining the subscribe function and return the pubsub.asyncIterator in the method
        //recall pubsub is passed through the context property
        //so we call the asyncIterator() ==> this method accepts a string as the chanel name
        countSub:{
            subscribe(parent,args,ctx,info){
                //define your publish method ==> this accepts the channel name and an object where we defined our schema and what it should return
                pubsub.publish("countChanel", { countSub: count });
                return pubsub.asyncIterator("countChanel"); 
            }
        }
    }

    PS: my subscription subscribe() must return the asyncIterator() but I can set up my publish in any resolver that i want to

    So basically, in the subscribe() is where we create a channel name for the client to listen in on and if any change is published to that channel name, the server returns the changes and the client can see it because it was already listening in on the channel

    ABOUT THE SCHEMA
    each subscription returns a type although it can return an array if you set it up to do so, but in our case, we are listening for when a comment is created or updated or deleted, so the return type will be a Comment object

*/