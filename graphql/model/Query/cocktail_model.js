const {UserInputError} = require('apollo-server-express');


const getCocktailRecipe = async (args, context)=>{
  const {id} = args;
  const {tools, pubsub, req} = context;

  if (id) {
    const cocktail = await tools.DB.query('select * from cocktails where id=?', id);
    if (cocktail.length===0) {
      return new UserInputError('Wrong cocktial id!');
    }
    try {
      await tools.DB.transaction();
      await tools.DB.query('UPDATE cocktails SET views = IFNULL(views, 0) +1 WHERE id = ? ', id);
      await tools.DB.commit();
    } catch (error) {
      console.log(error);
      await tools.DB.rollback();
    }
    cocktail[0].ingredients = JSON.parse(cocktail[0]['ingredients']);
    cocktail[0].steps = JSON.parse(cocktail[0]['steps']);
    return cocktail;
  }
  const cocktailssql = 'select * from cocktails';
  const cocktails = await tools.DB.query(cocktailssql);
  pubsub.publish('new_viewer', {newViewer: req.id});
  cocktails.forEach((cocktail)=> {
    cocktail.ingredients = JSON.parse(cocktail['ingredients']);
    cocktail.steps = JSON.parse(cocktail['steps']);
  });
  return cocktails;
};

const getThreeSelections = async (context)=>{
  const hots_sql = 'select * from cocktails order by views DESC limit 3 ';
  const tops_sql = 'select * from cocktails order by likes DESC limit 3 ';
  const news_sql = 'select * from cocktails order by id DESC limit 3 ';
  const hots = await context.tools.DB.query(hots_sql);
  const tops = await context.tools.DB.query(tops_sql);
  const news = await context.tools.DB.query(news_sql);
  return {hots, tops, news};
};


const getCategories = async (context)=>{
  const categories = await context.tools.DB.query('SELECT DISTINCT category FROM cocktails;');
  const category = await categories .map((e)=>{
    return e.category;
  });
  return category;
};


const getRecipesPaging = async (args, context) =>{
  const {first, after, last, before} =args;

  if (!first && after) {
    throw new UserInputError('after must be with first');
  }
  if ((last && !before) || (!last && before)) {
    throw new UserInputError('last and before must be used together');
  }
  if (first && after && last && before) {
    throw new UserInputError('Incorrect Arguments Usage.');
  }

  let recipes;

  if (args.category&&args.ingredient) {
    recipes = await getIngredientWithCategoryRecipes(args, context);
  }
  if (args.category&&args.author) {
    recipes = await getCategoryWithAuthorRecipes(args, context);
  }
  if (args.category) {
    recipes = await getCategoryRecipes(args, context);
  }
  if (args.author) {
    recipes = await getAuthorRecipes(args, context);
  }
  if (args.ingredient) {
    recipes = await getIngredientRecipes(args, context);
  }
  if (!args.category&&!args.ingredient&&!args.author) {
    recipes = await getAllRecipes(args, context);
  }


  if (recipes[0]) {
    const countWithoutLimit = recipes[0].count||0;
    const allCount = await context.tools.DB.query('SELECT count(*) as number FROM cocktails;');
    const allnumber = allCount[0].number;
    recipes.forEach((cocktail)=> {
      cocktail.ingredients = JSON.parse(cocktail['ingredients']);
      cocktail.steps = JSON.parse(cocktail['steps']);
    });
    return {
      edges: recipes.map((recipe)=>({
        cursor: recipe.id,
        node: recipe,
      })),
      pageInfo: {
        hasNextPage: first ? countWithoutLimit > first : allnumber > countWithoutLimit,
        hasPreviousPage: last ? countWithoutLimit > last : allnumber > countWithoutLimit,
        totalPageCount: Math.ceil(allnumber / (first || last)),
      },
    };
  }
  return new UserInputError('no result');
};


const getAllRecipes = async (args, context) =>{
  if (args.sort === 'DESC') {
    if (args.first) {
      return args.after ?
                await context.tools.DB.query('SELECT * , count(*) OVER() AS count FROM cocktails WHERE id < ? ORDER BY id DESC LIMIT ?', [args.after, args.first]) :
                await context.tools.DB.query('SELECT * , count(*) OVER() AS count FROM cocktails  ORDER BY id DESC LIMIT ? ', [args.first]);
    }
    if (args.last) {
      return await context.tools.DB.query(` SELECT * FROM (
                SELECT *, count(*) OVER() AS count FROM cocktails WHERE id > ? ORDER BY id ASC LIMIT ?
             ) cocktails ORDER BY id DESC `, [args.before, args.last]);
    }
  } else {
    if (args.first) {
      return args.after ?
                await context.tools.DB.query('SELECT * , count(*) OVER() AS count FROM cocktails WHERE id > ? ORDER BY id LIMIT ?', [args.after, args.first]) :
                await context.tools.DB.query('SELECT * , count(*) OVER() AS count FROM cocktails  ORDER BY id LIMIT ? ', [args.first]);
    }
    if (args.last) {
      return await context.tools.DB.query(` SELECT * FROM (
                SELECT *, count(*) OVER() AS count FROM cocktails WHERE id < ? ORDER BY id DESC LIMIT ?
             ) cocktails ORDER BY id `, [args.before, args.last]);
    }
  }
};


const getAuthorRecipes = async (args, context) =>{
  const auth = `%${args.author}%`;

  if (args.sort === 'DESC') {
    if (args.first) {
      return args.after ?
                await context.tools.DB.query('SELECT * , count(*) OVER() AS count FROM cocktails WHEREargs. author like ? && id < ? ORDER BY id DESC LIMIT ?', [auth, args.after, args.first]) :
                await context.tools.DB.query('SELECT * , count(*) OVER() AS count FROM cocktails WHERE author like ? ORDER BY id DESC LIMIT ? ', [auth, args.first]);
    }
    if (args.last) {
      return await context.tools.DB.query(` SELECT * FROM (
                    SELECT *, count(*) OVER() AS count FROM cocktails WHERE  author like ? && id > ? ORDER BY id DESC LIMIT ?
                 ) cocktails ORDER BY id DESC `, [auth, args.before, args.last]);
    }
  } else {
    if (args.first) {
      return args.after ?
                await context.tools.DB.query('SELECT * , count(*) OVER() AS count FROM cocktails WHERE author like ? && id > ? ORDER BY id LIMIT ?', [auth, args.after, args.first]) :
                await context.tools.DB.query('SELECT * , count(*) OVER() AS count FROM cocktails WHERE author like ? ORDER BY id LIMIT ? ', [auth, args.first]);
    }
    if (args.last) {
      return await context.tools.DB.query(` SELECT * FROM (
                    SELECT *, count(*) OVER() AS count FROM cocktails WHERE  author like ? && id < ? ORDER BY id ASC LIMIT ?
                 ) cocktails ORDER BY id `, [auth, args.before, args.last]);
    }
  }
};


const getCategoryRecipes = async (args, context) =>{
  const {first, after, last, before, sort, category} =args;


  if (sort === 'DESC') {
    if (first) {
      return after ?
                await context.tools.DB.query('SELECT * , count(*) OVER() AS count FROM cocktails WHERE category = ? && id < ? ORDER BY id DESC LIMIT ?', [category, after, first]) :
                await context.tools.DB.query('SELECT * , count(*) OVER() AS count FROM cocktails WHERE category = ? ORDER BY id DESC LIMIT ? ', [category, first]);
    }
    if (last) {
      return await context.tools.DB.query(` SELECT * FROM (
                    SELECT *, count(*) OVER() AS count FROM cocktails WHERE  category = ? && id > ? ORDER BY id DESC LIMIT ?
                 ) cocktails ORDER BY id DESC `, [category, before, last]);
    }
  } else {
    if (first) {
      return after ?
                await context.tools.DB.query('SELECT * , count(*) OVER() AS count FROM cocktails WHERE category = ? && id > ? ORDER BY id LIMIT ?', [category, after, first]) :
                await context.tools.DB.query('SELECT * , count(*) OVER() AS count FROM cocktails WHERE category = ? ORDER BY id LIMIT ? ', [category, first]);
    }
    if (last) {
      return await context.tools.DB.query(` SELECT * FROM (
                    SELECT *, count(*) OVER() AS count FROM cocktails WHERE  category = ? && id < ? ORDER BY id ASC LIMIT ?
                 ) cocktails ORDER BY id `, [category, before, last]);
    }
  }
};

const getIngredientRecipes = async (args, context) =>{
  const ingri = `%${args.ingredient}%`;
  if (args.sort === 'DESC') {
    if (args.first) {
      return args.after ?
                await context.tools.DB.query('SELECT * , count(*) OVER() AS count FROM cocktails WHERE ingredients like ? && id < ? ORDER BY id DESC LIMIT ?', [ingri, args.after, args.first]) :
                await context.tools.DB.query('SELECT * , count(*) OVER() AS count FROM cocktails WHERE ingredients like ? ORDER BY id DESC LIMIT ? ', [ingri, args.first]);
    }
    if (args.last) {
      return await context.tools.DB.query(` SELECT * FROM (
                    SELECT *, count(*) OVER() AS count FROM cocktails WHERE  ingredients like ? && id > ? ORDER BY id DESC LIMIT ?
                 ) cocktails ORDER BY id DESC`, [ingri, args.before, args.last]);
    }
  } else {
    if (args.first) {
      return args.after ?
                await context.tools.DB.query('SELECT * , count(*) OVER() AS count FROM cocktails WHERE ingredients like ? && id > ? ORDER BY id ASC LIMIT ?', [ingri, args.after, args.first]) :
                await context.tools.DB.query('SELECT * , count(*) OVER() AS count FROM cocktails WHERE ingredients like ? ORDER BY id ASC LIMIT ? ', [ingri, args.first]);
    }
    if (args.last) {
      return await context.tools.DB.query(` SELECT * FROM (
                    SELECT *, count(*) OVER() AS count FROM cocktails WHERE  ingredients like ? && id < ? ORDER BY id ASC LIMIT ?
                 ) cocktails ORDER BY id ASC`, [ingri, args.before, args.last]);
    }
  }
};


const getCategoryWithAuthorRecipes = async (args, context) =>{
  const auth = `%${args.author}%`;
  if (args.sort === 'DESC') {
    if (args.first) {
      return args.after ?
                await context.tools.DB.query('SELECT * , count(*) OVER() AS count FROM cocktails WHERE category = ? && author like ? && id < ? ORDER BY id DESC LIMIT ?', [args.category, auth, args.after, args.first]) :
                await context.tools.DB.query('SELECT * , count(*) OVER() AS count FROM cocktails WHERE category = ? && author like ? ORDER BY id  DESC LIMIT ? ', [args.category, auth, args.first]);
    }
    if (args.last) {
      return await context.tools.DB.query(` SELECT * FROM (
                    SELECT *, count(*) OVER() AS count FROM cocktails WHERE  category = ? && author like ? && id > ? ORDER BY id DESC LIMIT ?
                 ) cocktails ORDER BY id DESC`, [args.category, auth, args.before, args.last]);
    }
  } else {
    if (args.first) {
      return args.after ?
                await context.tools.DB.query('SELECT * , count(*) OVER() AS count FROM cocktails WHERE category = ? && author like ? && id > ? ORDER BY id LIMIT ?', [args.category, auth, args.after, args.first]) :
                await context.tools.DB.query('SELECT * , count(*) OVER() AS count FROM cocktails WHERE category = ? && author like ? ORDER BY id LIMIT ? ', [args.category, auth, args.first]);
    }
    if (args.last) {
      return await context.tools.DB.query(` SELECT * FROM (
                    SELECT *, count(*) OVER() AS count FROM cocktails WHERE  category = ? && author like ? && id < ? ORDER BY id ASC LIMIT ?
                 ) cocktails ORDER BY id `, [args.category, auth, args.before, args.last]);
    }
  }
};


const getIngredientWithCategoryRecipes = async (args, context) =>{
  const ingri = `%${args.ingredient}%`;
  if (args.sort === 'DESC') {
    if (args.first) {
      return args.after ?
                await context.tools.DB.query('SELECT * , count(*) OVER() AS count FROM cocktails WHERE category =? && ingredients like ? && id < ?  ORDER BY id DESC LIMIT ?', [args.category, ingri, args.after, args.first]) :
                await context.tools.DB.query('SELECT * , count(*) OVER() AS count FROM cocktails WHERE category =? && ingredients like ? ORDER BY id DESC LIMIT ? ', [args.category, ingri, args.first]);
    }
    if (args.last) {
      return await context.tools.DB.query(` SELECT * FROM (
                    SELECT *, count(*) OVER() AS count FROM cocktails WHERE category =? &&  ingredients like ? && id > ? ORDER BY id DESC LIMIT ?
                 ) cocktails ORDER BY id DESC`, [args.category, ingri, args.before, args.last]);
    }
  } else {
    if (args.first) {
      return args.after ?
                await context.tools.DB.query('SELECT * , count(*) OVER() AS count FROM cocktails WHERE category =? && ingredients like ? && id > ?  ORDER BY id ASC LIMIT ?', [args.category, ingri, args.after, args.first]) :
                await context.tools.DB.query('SELECT * , count(*) OVER() AS count FROM cocktails WHERE category =? && ingredients like ? ORDER BY id ASC LIMIT ? ', [args.category, ingri, args.first]);
    }
    if (args.last) {
      return await context.tools.DB.query(` SELECT * FROM (
                    SELECT *, count(*) OVER() AS count FROM cocktails WHERE category =? &&  ingredients like ? && id < ? ORDER BY id ASC LIMIT ?
                 ) cocktails ORDER BY id ASC`, [args.category, ingri, args.before, args.last]);
    }
  }
};

module.exports = {
  getCocktailRecipe,
  getThreeSelections,
  getCategories,
  getRecipesPaging,
};
