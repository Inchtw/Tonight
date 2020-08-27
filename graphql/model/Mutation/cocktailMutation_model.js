
const {ApolloError} = require('apollo-server-express');


const likeCocktail = async (args, context) =>{
  const {likeInput} = args;
  if (context.me) {
    const cocktails = await context.tools.DB.query('select * from cocktails where id =? ', likeInput.id);
    const check = await context.tools.DB.query('select * from user_like_join where user_id =? and cocktail_id=? ', [context.me, likeInput.id]);
    if (check.length===0&&cocktails.length) {
      try {
        await context.tools.DB.transaction();
        await context.tools.DB.query('UPDATE cocktails SET likes = IFNULL(likes, 0) +1 WHERE id = ? ', likeInput.id);
        await context.tools.DB.query('INSERT INTO user_like_join SET ?', [{user_id: context.me, cocktail_id: likeInput.id}]);
        await context.tools.DB.commit();
        await context.dataloaders.userLoaders.userLikesDataLoader.clear(context.me);
        return true;
      } catch (error) {
        console.log(error);
        await context.tools.DB.rollback();
        return {error};
      }
    } else if (check.length>0) {
      try {
        await context.tools.DB.transaction();
        await context.tools.DB.query('UPDATE cocktails SET likes = likes -1 WHERE id = ? ', likeInput.id);
        await context.tools.DB.query('delete from user_like_join where user_id =? and cocktail_id=?', [context.me, likeInput.id]);
        await context.tools.DB.commit();
        await context.dataloaders.userLoaders.userLikesDataLoader.clear(context.me);

        return false;
      } catch (error) {
        console.log(error);
        await context.tools.DB.rollback();
        return {error};
      }
    }
    throw new ApolloError('Wrong Cocktail id!');
  }
  throw new ApolloError('Need Login to like!');
};


const createCocktail = async (args, context) =>{
  const {name, ori_image, description, category, ingredients, steps} = args.cocktailInput;
  const author_id = context.me;

  try {
    await context.tools.DB.transaction();
    const authors = await context.tools.DB.query('Select name from user where id = ?', author_id);
    const author= authors[0];
    const cocktail_info = {
      name,
      ori_image,
      description,
      resource: 'Tonight',
      link: 'https://tonight-drink.website/',
      author_id,
      author: author.name,
      ingredients: JSON.stringify(ingredients),
      category,
      steps: JSON.stringify(steps),
      createdAt: context.tools.moment().format('YYYY/MM/DD HH:mm:ss'),
    };
    const createQuery = 'INSERT INTO cocktails SET ?';


    const cockinsert = await context.tools.DB.query(createQuery, cocktail_info);
    cocktail_info.link = `detail.html?id=${cockinsert.insertId}`;
    cocktail_info.ingredients =ingredients;
    cocktail_info.steps =steps;
    cocktail_info.id = cockinsert.insertId;
    // need to update link
    await context.tools.DB.commit();
    await context.dataloaders.userLoaders.userPostsDataLoader.clear(context.me);
    return cocktail_info;
  } catch (error) {
    await context.tools.DB.rollback();
    console.log(error);
    return {error};
  }
};


const commentCocktail = async (args, context) =>{
  if (context.me) {
    const {cocktail_id, rank, comment, img, title} = args.commentInput;
    const user_id = context.me;
    try {
      const commentInfos = {user_id, cocktail_id, rank, comment, img, title};
      await context.tools.DB.transaction();
      const commentQuery = 'INSERT INTO comments SET ?';
      await context.tools.DB.query(commentQuery, commentInfos);
      await context.tools.DB.query('UPDATE cocktails SET comment = IFNULL(comment, 0) +1 WHERE id = ? ', cocktail_id);
      await context.tools.DB.query(`UPDATE cocktails SET cocktails.rank = (SELECT AVG(comments.rank) 
            FROM comments where comments.cocktail_id = ?
            ) WHERE id = ? `, [cocktail_id, cocktail_id]);
      await context.tools.DB.commit();
      await context.dataloaders.cocktailLoaders.cocktailCommentsDataLoader.clear(+cocktail_id);
      await context.dataloaders.userLoaders.userCommentsDataLoader.clear(context.me);
      return commentInfos;
    } catch (error) {
      await context.tools.DB.rollback();
      console.log(error);
      return {error};
    }
  }
  throw new ApolloError('need login');
};


module.exports ={

  likeCocktail,
  commentCocktail,
  createCocktail,


};
