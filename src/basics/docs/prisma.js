/*
//Relation types are not added to the db but they are used by Prisma Client
//To show table relationships for 1 - many or 1 - 1:
//1. 2 relation types must be defined in both models for e.g User - Post
//on User we have <posts Post[]> ==> which means a user can have many posts; [] ==> turns the post field to a list
//on Post we have <author User> ==> which means a post can only be written by 1 user

//2. @relation attribute can be on only one of the 2 Models, can be on any one and that model will also have the FK
//I chose the Post model and authorId is the FK

//PS In a 1 - 1, the side of the relation without a relation scalar (the field representing FK in the database) must be optional:
//e.g assuming User - Post is a 1 - 1 relationship, with schema defined as follows
//on User we have <posts Post>
//on Post we have <author User>
//I can add my relation attribute on any of the 2 models and that model will alos have FK. how ever on the other model(the one without FK), I must specify the relation model as optional by adding <?>


//@relation() this explains the following
  //1. the User table is related to the Post table
  //2. the aurthorId field is FK, referencing the id field on the User's table



  PRISMA 2 METHODS
  1. findMany() ==> accepts an optional object with properties such where, select or include defined
    when used without the object, it returns an array of objects showing only the scalar fields
    when used with the objects
    findMany({
      where:{
        name:{
          contains:"a"
        }
      },
      include:{
        posts:true
      }
    }) ==> still returns only scalar fields that pass that condition
  
    when includes is used, then it will return both scalar and relation fields via eager loading, this means that we do not need to defined custom resolver methods any more but if we do, this custom methods are run when you want to fetch the relation fields. i.e it overrides the prisma default setting

    do not use select and include together on one level, it will throw error because select can perform the function of includes
    findMany({
      where:{
        name:{
          contains:"a"
        }
      },
      include:{
        posts:true
      },
      select:{
        email:true
      }
    })

    findMany({
      where:{
        name:{
          contains:"a"
        }
      },
      select:{
        email:true,
        posts:true
      }
    })
*/
