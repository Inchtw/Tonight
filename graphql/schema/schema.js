const { gql} = require('apollo-server-express');
const typeDefs = gql`

"""
之後要刪掉的
"""
  type Query {
    me : User
    cocktails(id:Int) : [Cocktail]
    users : [User]
    recipes : [Cocktail]
    reciepesPaging(first:Int,after:Int,last:Int,before:Int,category:String,author :String , ingredient :String, sort :String) : ReciepesConnection!
  }
  type Cocktail{
      "cocktail include recipes and other info"
      id: ID!
      name : String!
      ori_image : String 
      description : String 
      category : String 
      resource : String!
      link :  String 
      author : String 
      ingredients : [String!] 
      steps : [String!]!
      likeGivers : [User]
      likes : Int
      views : Int
      ranking : Float
      comments : [Comment]
      createdAt : String
      recommend :[Cocktail]
  }


input CocktailInput{
    name : String!
    ori_image : String! 
    description : String 
    category : String! 
    ingredients : [String!] 
    steps : [String!]!
}

input CommentInput{
    id : ID!
    name : String!
    photo : String!
    img : String
    comment : String
    rank : Int!

}


type Comment{
    "user ID"
    id: ID!
    "user name"
    name : String!
    "user photo"
    photo : String!
    img : String
    comment : String
    rank : Int! 

}

type User {
    id: ID!
    email: String
    password: String
    name : String!
    photo : String
    friends :[User]
    post : [Cocktail]
    comments :  [Comment]
    subsriptions : [User]
    followers : [User]
    likes : [Cocktail]

    
}

type AuthUser {
    id: ID!
    name : String!
    photo : String
    gender : String
    accessToken : String!
}

input UserInput {
    email: String!
    name : String!
    password: String!
}
input Userlogin {
    email: String!
    password: String!
}

input SubscribeInput{
    id : ID!
}


input AddFriendInput {
    id : ID!
}

input UpdateMyInfoInput {
    nickname : String
    password: String
    photo: String
}

type ReciepesConnection {
    edges : [RecipesEdge!]!
    pageInfo: PageInfo!
}

type RecipesEdge {
    cursor : ID!
    node: Cocktail!
}

type PageInfo {
    hasNextPage :  Boolean!
    hasPreviousPage: Boolean!
    totalPageCount: Int
}

type Mutation{
    createCocktail( cocktailInput :CocktailInput!) : Cocktail
    createUser(userInput : UserInput! ) : AuthUser
    login(Userlogin:Userlogin! ) : AuthUser
    updateMyInfo(updateMyInfoInput :UpdateMyInfoInput ) :User
    likeCocktail(cocktailId:Int!) : Cocktail
    commentCocktail(CommentInput : CommentInput) : Comment
    subscribeAuthor(SubscribeInput:SubscribeInput) : Boolean
}
type Subscription {
    newUser: User
    newViewer : Int
  }

`;
module.exports ={
    typeDefs

};