const { gql} = require('apollo-server-express');
const typeDefs = gql`

"""
之後要刪掉的
"""


  type Query {
    "A simple type for getting started!"
    hello: String
    me : User
    cocktails(id:Int) : [Cocktail]
    users : [User]
    recipes : [Cocktail]
    reciepesPaging(first:Int,after:Int,last:Int,before:Int,category:String) : ReciepesConnection!
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
      createdAt : String
  }

input CocktailInput{
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
}
type User {
    id: ID!
    email: String!
    password: String
    name : String!
    friends :[User]
}

type AuthUser {
    id: ID!
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
}
type Subscription {
    newUser: User
    newViewer : Int
  }

`;
module.exports ={
    typeDefs

};