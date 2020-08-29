const {groupBy, map} = require('ramda');
const DataLoader = require('dataloader');
const DB = require('../../../../utils/mysqlcon');


function cocktailCommentsDataLoader() {
  return new DataLoader(commentsByCocktailIds);
}
async function commentsByCocktailIds(cocktailIds) {
  const commentsSql =`SELECT user.id , user.name , user.photo , comments.cocktail_id, comments.img ,comments.comment ,comments.rank ,comments.title
    FROM comments
    inner Join  user
    ON user.id=comments.user_id
    where cocktail_id in (?) order by comments.id Desc`;
  const comments = await DB.query(commentsSql, [cocktailIds]);
  const groupById = groupBy((comment)=>comment.cocktail_id, comments);
  return await map((cocktail_id)=>groupById[cocktail_id], cocktailIds);
}

function cocktailLikersDataLoader() {
  return new DataLoader(likersByCocktailIds);
}
async function likersByCocktailIds(cocktailIds) {
  const cocktailLikers_sql = `SELECT  user.id  , user.name ,user.photo , user_like_join.cocktail_id   
    FROM user 
    left Join user_like_join
    on user.id = user_like_join.user_id
    where user_like_join.cocktail_id in(?) order by id DESC;;`;
  const likers = await DB.query(cocktailLikers_sql, [cocktailIds]);
  const groupById = groupBy((likers)=>likers.cocktail_id, likers);
  return await map((cocktail_id)=>groupById[cocktail_id], cocktailIds);
}

function authorDataLoader() {
  return new DataLoader(authorByAuthorIds);
}
async function authorByAuthorIds(author_ids) {
  const Cocktail_Author_sql = 'SELECT id, name, photo From user where id in (?) ';
  const author_infos = await DB.query(Cocktail_Author_sql, [author_ids]);
  const groupById = groupBy((author)=>author.id, author_infos);
  return await map((id)=>groupById[id], author_ids);
}


module.exports={
  cocktailCommentsDataLoader: cocktailCommentsDataLoader(),
  authorDataLoader: authorDataLoader(),
  cocktailLikersDataLoader: cocktailLikersDataLoader(),
};
