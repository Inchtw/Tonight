const {gql} = require('apollo-server-express');
const typeDefs = gql`
"Cocktail include recipes and other info"
  type Cocktail{
    " Cocktail's ID"
    id: ID!
    name : String!
    ori_image : String 
    description : String 
    category : String 
    resource : String!
    link :  String 
    author : User 
    ingredients : [String!] 
    steps : [String!]!
    likeGivers : [User]
    likes : Int
    views : Int
    rank : Float
    comment : Int
    comments : [Comment]
    createdAt : String
    recommend :[Cocktail]
    author_id : Int
  }
  type CocktailThree{
    " base on viewers "
    hots:[Cocktail]
    " base on likes "
    tops:[Cocktail]
    " latest "
    news:[Cocktail]
  }

"For create cocktail"
input CocktailInput{
    name : String!
    ori_image : String! 
    description : String 
    category : String! 
    ingredients : [String!] 
    steps : [String!]!
}

input CommentInput{
    cocktail_id : ID!
    img : String
    comment : String
    rank : Int!
    title : String
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
    title : String
}

type User {
    id: ID!
    email: String
    password: String @deprecated (reason: "It's secret")
    name : String!
    photo : String
    friends :[User]
    post : [Cocktail]
    comments :  [Comment]
    subscriptions : [User]
    followers : [User]
    likes : [Cocktail]
    recommend : [Cocktail]
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

input LikeInput {
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

type Query {
    me : User
    cocktails(id:Int) : [Cocktail]
    users(id:Int) : [User]
    reciepesPaging(first:Int,after:Int,last:Int,before:Int,category:String,author :String , ingredient :String, sort :String) : ReciepesConnection!
    cocktailThree : CocktailThree
    categories : [String]
}

type Mutation{
    createCocktail( cocktailInput :CocktailInput!) : Cocktail
    createUser(userInput : UserInput! ) : AuthUser
    login(Userlogin:Userlogin! ) : AuthUser
    updateMyInfo(updateMyInfoInput :UpdateMyInfoInput ) :User
    likeCocktail(likeInput:LikeInput!) : Boolean
    commentCocktail(commentInput : CommentInput) : Comment
    subscribeAuthor(SubscribeInput:SubscribeInput) : Boolean
}

type Subscription {
    newUser: User
    newViewer : Int
}
`;

module.exports ={
  typeDefs,
};


// input SubscribeInput {
//     id : ID!
// }

// input LikeInput {
//     id : ID!
// }
