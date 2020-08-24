const {groupBy, map } = require('ramda');
const DataLoader = require('dataloader');
const DB = require('../../../../utils/mysqlcon');


function userCommentsDataLoader(){
    return new DataLoader(commentsByUserIds);
}
async function commentsByUserIds(userIds){
    const myComment_sql = 'SELECT * FROM tonight.comments where user_id in (?) order by id DESC';
    const userComments = await DB.query(myComment_sql,[userIds]);
    const groupById = groupBy(comment=>comment.user_id , userComments);
    return await map(user_id=>groupById[user_id], userIds);

}

function userLikesDataLoader(){
    return new DataLoader(likesByUserIds);
}
async function likesByUserIds(userIds){
    const mylikes_sql = `SELECT * , cocktails.id as LIKE_ID
            FROM cocktails
            INNER JOIN  user_like_join
            ON user_like_join.cocktail_id=cocktails.id
            where user_like_join.user_id in (?) order by LIKE_ID DESC `;
    const userLikes = await DB.query(mylikes_sql,[userIds]);
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
    const userSub_sql = `SELECT  user.id , user.name ,user.photo , user_subscribe_join.user_id  as me_id
    FROM user 
    left Join user_subscribe_join
    on user.id = user_subscribe_join.author_id
    where user_subscribe_join.user_id in(?) order by id DESC
    
    ;`;
    const userSubscriptions = await DB.query(userSub_sql,[userIds]);
    const groupById = groupBy(subscribed=>subscribed.me_id , userSubscriptions);

    return await map(me_id=>groupById[me_id], userIds);
}

function userFollowersDataLoader(){
    return new DataLoader(userFollowersByUserIds);
}
async function userFollowersByUserIds(userIds){
    const userFollowers_sql = `SELECT  user.id  , user.name ,user.photo , user_subscribe_join.author_id  as me_id
    FROM user 
    left Join user_subscribe_join
    on user.id = user_subscribe_join.user_id
    where user_subscribe_join.author_id in(?) order by id DESC;`;
    const userFollowers = await DB.query(userFollowers_sql,[userIds]);
    const groupById = groupBy(follower=>follower.me_id , userFollowers);

    return await map(me_id=>groupById[me_id], userIds);
}

function userPostsDataLoader(){
    return new DataLoader(userPostsByUserIds);
}
async function userPostsByUserIds(userIds){
    const userPost_sql = `SELECT *
    FROM cocktails
   where author_id in (?) order by id DESC limit 300 ;`;
    const myposts = await DB.query(userPost_sql,[userIds]);
    myposts.forEach(cocktail=> {
        cocktail.ingredients = JSON.parse(cocktail['ingredients']);
        cocktail.steps = JSON.parse(cocktail['steps']);
    });
    const groupById = groupBy(post=>post.author_id , myposts);
    return await map(author_id=>groupById[author_id], userIds);
}


module.exports={

    userCommentsDataLoader : userCommentsDataLoader(),
    userLikesDataLoader : userLikesDataLoader(),
    userSubscriptionsDataLoader : userSubscriptionsDataLoader(),
    userFollowersDataLoader : userFollowersDataLoader(),
    userPostsDataLoader : userPostsDataLoader(),


};