
const {groupBy, map } = require('ramda');

const tools = require('./context');

const DataLoader = require('dataloader');


function cocktailCommentsDataLoader(){
    return new DataLoader(commentsByCocktailIds);
}
async function commentsByCocktailIds(cocktailIds){
    const commentsSql =`SELECT user.id , user.name , user.photo , comments.cocktail_id, comments.img ,comments.comment ,comments.rank ,comments.title
    FROM comments
    inner Join  user
    ON user.id=comments.user_id
    where cocktail_id in (?) order by comments.id Desc`;

    let comments = await tools.DB.query(commentsSql,[cocktailIds]);
    const groupById = groupBy(comment=>comment.cocktail_id , comments);
    return await map(cocktail_id=>groupById[cocktail_id], cocktailIds);

}


function cocktailLikersDataLoader(){
    return new DataLoader(likersByCocktailIds);
}
async function likersByCocktailIds(cocktailIds){
    let cocktailLikers_sql = `SELECT  user.id  , user.name ,user.photo , user_like_join.cocktail_id   
    FROM user 
    left Join user_like_join
    on user.id = user_like_join.user_id
    where user_like_join.cocktail_id in(?) order by id DESC;;`;
    let likers = await tools.DB.query(cocktailLikers_sql,[cocktailIds]);
    // console.log(userSubscriptions);
    const groupById = groupBy(likers=>likers.cocktail_id , likers);
    console.log(groupById);
    let a = await map(cocktail_id=>groupById[cocktail_id], cocktailIds);
    console.log(a);

    return await map(cocktail_id=>groupById[cocktail_id], cocktailIds);
}


function authorDataLoader(){
    return new DataLoader(authorByAuthorIds);
}
async function authorByAuthorIds(author_ids){
    let Cocktail_Author_sql = 'SELECT id, name, photo,intro From user where id in (?) ';
    let author_infos = await tools.DB.query(Cocktail_Author_sql,[author_ids]);
    const groupById = groupBy(author=>author.id , author_infos);
    return await map(id=>groupById[id], author_ids);
}
function userCommentsDataLoader(){
    return new DataLoader(commentsByUserIds);
}
async function commentsByUserIds(userIds){
    let myComment_sql = 'SELECT * FROM tonight.comments where user_id in (?) order by id DESC';
    let userComments = await tools.DB.query(myComment_sql,[userIds]);
    const groupById = groupBy(comment=>comment.user_id , userComments);
    return await map(user_id=>groupById[user_id], userIds);

}

function userLikesDataLoader(){
    return new DataLoader(likesByUserIds);
}
async function likesByUserIds(userIds){
    let mylikes_sql = `SELECT * , cocktails.id as LIKE_ID
            FROM cocktails
            INNER JOIN  user_like_join
            ON user_like_join.cocktail_id=cocktails.id
            where user_like_join.user_id in (?) order by LIKE_ID DESC `;
    let userLikes = await tools.DB.query(mylikes_sql,[userIds]);
    // console.log(userLikes);
    userLikes.forEach(e=>{
        if(e){
            e.id = e.LIKE_ID;

        }
    });
    const groupById = groupBy(like=>like.user_id , userLikes);
    return await map(user_id=>groupById[user_id], userIds);
}

function userSubscriptionsDataLoader(){
    return new DataLoader(subscriptionsByUserIds);
}
async function subscriptionsByUserIds(userIds){
    let userSub_sql = `SELECT  user.id , user.name ,user.photo , user_subscribe_join.user_id  as me_id
    FROM user 
    left Join user_subscribe_join
    on user.id = user_subscribe_join.author_id
    where user_subscribe_join.user_id in(?) order by id DESC
    
    ;`;
    let userSubscriptions = await tools.DB.query(userSub_sql,[userIds]);
    // console.log(userSubscriptions);
    const groupById = groupBy(subscribed=>subscribed.me_id , userSubscriptions);
    let a = await map(me_id=>groupById[me_id], userIds);

    return await map(me_id=>groupById[me_id], userIds);
}

function userFollowersDataLoader(){
    return new DataLoader(userFollowersByUserIds);
}
async function userFollowersByUserIds(userIds){
    let userFollowers_sql = `SELECT  user.id  , user.name ,user.photo , user_subscribe_join.author_id  as me_id
    FROM user 
    left Join user_subscribe_join
    on user.id = user_subscribe_join.user_id
    where user_subscribe_join.author_id in(?) order by id DESC;`;
    let userFollowers = await tools.DB.query(userFollowers_sql,[userIds]);
    const groupById = groupBy(follower=>follower.me_id , userFollowers);

    return await map(me_id=>groupById[me_id], userIds);
}

function userPostsDataLoader(){
    return new DataLoader(userPostsByUserIds);
}
async function userPostsByUserIds(userIds){
    let userPost_sql = `SELECT *
    FROM cocktails
   where author_id in (?) order by id DESC ;`;
    let myposts = await tools.DB.query(userPost_sql,[userIds]);
    // console.log(userSubscriptions);
    myposts.forEach(cocktail=> {
        cocktail.ingredients = JSON.parse(cocktail['ingredients']);
        cocktail.steps = JSON.parse(cocktail['steps']);
    });
    const groupById = groupBy(post=>post.author_id , myposts);
    // console.log(groupById);
    let a = await map(author_id=>groupById[author_id], userIds);
    // console.log(a);

    return await map(author_id=>groupById[author_id], userIds);
}




module.exports={



    cocktailCommentsDataLoader : cocktailCommentsDataLoader(),
    authorDataLoader : authorDataLoader(),
    userCommentsDataLoader : userCommentsDataLoader(),
    userLikesDataLoader : userLikesDataLoader(),
    userSubscriptionsDataLoader : userSubscriptionsDataLoader(),
    userFollowersDataLoader : userFollowersDataLoader(),
    userPostsDataLoader : userPostsDataLoader(),
    cocktailLikersDataLoader : cocktailLikersDataLoader()


};