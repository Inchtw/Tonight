const { UserInputError } = require('apollo-server-express');


const getRecipesPaging = async(args,tools) =>{

    const {first, after, last, before,sort} =args;

    if (!first && after) {throw new UserInputError('after must be with first');}
    if ((last && !before) || (!last && before)) {throw new UserInputError('last and before must be used together');}
    if (first && after && last && before) {throw new UserInputError('Incorrect Arguments Usage.');}
    let recipes;

    if(sort === 'DESC'){
        if(first){
            recipes = after
                ? await tools.DB.query('SELECT * , count(*) OVER() AS count FROM cocktails WHERE id < ? ORDER BY id DESC LIMIT ?', [after, first])
                : await tools.DB.query('SELECT * , count(*) OVER() AS count FROM cocktails  ORDER BY id DESC LIMIT ? ', [ first]);
        }
        if(last){
            recipes = await tools.DB.query(` SELECT * FROM (
                SELECT *, count(*) OVER() AS count FROM cocktails WHERE id > ? ORDER BY id ASC LIMIT ?
             ) cocktails ORDER BY id DESC `, [before, last]);
        }
    }else{
        if(first){
            recipes = after
                ? await tools.DB.query('SELECT * , count(*) OVER() AS count FROM cocktails WHERE id > ? ORDER BY id LIMIT ?', [after, first])
                : await tools.DB.query('SELECT * , count(*) OVER() AS count FROM cocktails  ORDER BY id LIMIT ? ', [ first]);
        }
        if(last){
            recipes = await tools.DB.query(` SELECT * FROM (
                SELECT *, count(*) OVER() AS count FROM cocktails WHERE id < ? ORDER BY id DESC LIMIT ?
             ) cocktails ORDER BY id `, [before, last]);
        }

    }
    const countWithoutLimit = recipes[0].count;
    let allCount ;

    allCount = await tools.DB.query('SELECT count(*) as number FROM cocktails;');
    const allnumber = allCount[0].number;
    recipes.forEach(cocktail=> {
        cocktail.ingredients = JSON.parse(cocktail['ingredients']);
        cocktail.steps = JSON.parse(cocktail['steps']);
    });
    return{
        edges: recipes.map(recipe=>({
            cursor : recipe.id,
            node: recipe
        })),
        pageInfo:{
            hasNextPage: first ? countWithoutLimit > first : allnumber > countWithoutLimit,
            hasPreviousPage: last ? countWithoutLimit > last : allnumber > countWithoutLimit,
            totalPageCount: Math.ceil(allnumber / (first || last))
        }
    };
};

const getRecipes = async(args,context)=>{
    let {id} = args;
    let {tools,pubsub,req} = context;

    if(id){

        let cocktail = await tools.DB.query('select * from cocktails where id=?',id);
        if(cocktail.length===0){
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
    let cocktailssql = 'select * from cocktails';
    let cocktails = await tools.DB.query(cocktailssql);
    pubsub.publish('new_viewer', { newViewer : req.id});
    cocktails.forEach(cocktail=> {
        cocktail.ingredients = JSON.parse(cocktail['ingredients']);
        cocktail.steps = JSON.parse(cocktail['steps']);
    });
    return  cocktails;


};


const getCategoryPaging = async(args,context)=>{

    const {first, after, last, before,category ,sort} =args;

    if (!first && after) {throw new UserInputError('after must be with first');}
    if ((last && !before) || (!last && before)) {throw new UserInputError('last and before must be used together');}
    if (first && after && last && before) {throw new UserInputError('Incorrect Arguments Usage.');}
    let recipes;

    if(sort === 'DESC'){
        if(first){
            recipes = after
                ? await context.tools.DB.query('SELECT * , count(*) OVER() AS count FROM cocktails WHERE category = ? && id < ? ORDER BY id DESC LIMIT ?', [category,after, first])
                : await context.tools.DB.query('SELECT * , count(*) OVER() AS count FROM cocktails WHERE category = ? ORDER BY id DESC LIMIT ? ', [ category,first]);
        }
        if(last){
            recipes = await context.tools.DB.query(` SELECT * FROM (
                    SELECT *, count(*) OVER() AS count FROM cocktails WHERE  category = ? && id > ? ORDER BY id DESC LIMIT ?
                 ) cocktails ORDER BY id DESC `, [category,before, last]);

        }
    }else{
        if(first){
            recipes = after
                ? await context.tools.DB.query('SELECT * , count(*) OVER() AS count FROM cocktails WHERE category = ? && id > ? ORDER BY id LIMIT ?', [category,after, first])
                : await context.tools.DB.query('SELECT * , count(*) OVER() AS count FROM cocktails WHERE category = ? ORDER BY id LIMIT ? ', [ category,first]);
        }
        if(last){
            recipes = await context.tools.DB.query(` SELECT * FROM (
                    SELECT *, count(*) OVER() AS count FROM cocktails WHERE  category = ? && id < ? ORDER BY id ASC LIMIT ?
                 ) cocktails ORDER BY id `, [category,before, last]);

        }

    }

    const countWithoutLimit = recipes[0].count;
    let   allCount = await context.tools.DB.query('SELECT count(*) as number FROM cocktails WHERE category = ?',[category]);
    const allnumber = allCount[0].number;
    recipes.forEach(cocktail=> {
        cocktail.ingredients = JSON.parse(cocktail['ingredients']);
        cocktail.steps = JSON.parse(cocktail['steps']);
    });
    return{
        edges: recipes.map(recipe=>({
            cursor : recipe.id,
            node: recipe
        })),
        pageInfo:{
            hasNextPage: first ? countWithoutLimit > first : allnumber > countWithoutLimit,
            hasPreviousPage: last ? countWithoutLimit > last : allnumber > countWithoutLimit,
            totalPageCount: Math.ceil(allnumber / (first || last))
        }
    };
};

const getAuthorPaging = async(args,context)=>{

    const {first, after, last, before,author ,sort} =args;

    if (!first && after) {throw new UserInputError('after must be with first');}
    if ((last && !before) || (!last && before)) {throw new UserInputError('last and before must be used together');}
    if (first && after && last && before) {throw new UserInputError('Incorrect Arguments Usage.');}
    let recipes;

    let auth = `%${author}%`;

    if(sort === 'DESC'){
        if(first){
            recipes = after
                ? await context.tools.DB.query('SELECT * , count(*) OVER() AS count FROM cocktails WHERE author like ? && id < ? ORDER BY id DESC LIMIT ?', [auth,after, first])
                : await context.tools.DB.query('SELECT * , count(*) OVER() AS count FROM cocktails WHERE author like ? ORDER BY id DESC LIMIT ? ', [ auth,first]);
        }
        if(last){
            recipes = await context.tools.DB.query(` SELECT * FROM (
                    SELECT *, count(*) OVER() AS count FROM cocktails WHERE  author like ? && id > ? ORDER BY id DESC LIMIT ?
                 ) cocktails ORDER BY id DESC `, [auth,before, last]);

        }


    }else{
        if(first){
            recipes = after
                ? await context.tools.DB.query('SELECT * , count(*) OVER() AS count FROM cocktails WHERE author like ? && id > ? ORDER BY id LIMIT ?', [auth,after, first])
                : await context.tools.DB.query('SELECT * , count(*) OVER() AS count FROM cocktails WHERE author like ? ORDER BY id LIMIT ? ', [ auth,first]);
        }
        if(last){
            recipes = await context.tools.DB.query(` SELECT * FROM (
                    SELECT *, count(*) OVER() AS count FROM cocktails WHERE  author like ? && id < ? ORDER BY id ASC LIMIT ?
                 ) cocktails ORDER BY id `, [auth,before, last]);

        }

    }

    if(recipes[0]){

        const countWithoutLimit = recipes[0].count||0;
        let   allCount = await context.tools.DB.query('SELECT count(*) as number FROM cocktails WHERE author like ?',[auth]);
        const allnumber = allCount[0].number;
        recipes.forEach(cocktail=> {
            cocktail.ingredients = JSON.parse(cocktail['ingredients']);
            cocktail.steps = JSON.parse(cocktail['steps']);
        });
        return{
            edges: recipes.map(recipe=>({
                cursor : recipe.id,
                node: recipe
            })),
            pageInfo:{
                hasNextPage: first ? countWithoutLimit > first : allnumber > countWithoutLimit,
                hasPreviousPage: last ? countWithoutLimit > last : allnumber > countWithoutLimit,
                totalPageCount: Math.ceil(allnumber / (first || last))
            }
        };
    }
    return new UserInputError('no result');
};
const getIngredientPaging = async(args,context)=>{

    const {first, after, last, before,ingredient ,sort} =args;

    if (!first && after) {throw new UserInputError('after must be with first');}
    if ((last && !before) || (!last && before)) {throw new UserInputError('last and before must be used together');}
    if (first && after && last && before) {throw new UserInputError('Incorrect Arguments Usage.');}
    let recipes;

    let ingri = `%${ingredient}%`;
    if(sort === 'DESC'){
        if(first){
            recipes = after
                ? await context.tools.DB.query('SELECT * , count(*) OVER() AS count FROM cocktails WHERE ingredients like ? && id < ? ORDER BY id DESC LIMIT ?', [ingri,after, first])
                : await context.tools.DB.query('SELECT * , count(*) OVER() AS count FROM cocktails WHERE ingredients like ? ORDER BY id DESC LIMIT ? ', [ ingri,first]);
        }
        if(last){
            recipes = await context.tools.DB.query(` SELECT * FROM (
                    SELECT *, count(*) OVER() AS count FROM cocktails WHERE  ingredients like ? && id > ? ORDER BY id DESC LIMIT ?
                 ) cocktails ORDER BY id DESC`, [ingri,before, last]);

        }

    }else{
        if(first){
            recipes = after
                ? await context.tools.DB.query('SELECT * , count(*) OVER() AS count FROM cocktails WHERE ingredients like ? && id > ? ORDER BY id ASC LIMIT ?', [ingri,after, first])
                : await context.tools.DB.query('SELECT * , count(*) OVER() AS count FROM cocktails WHERE ingredients like ? ORDER BY id ASC LIMIT ? ', [ ingri,first]);
        }
        if(last){
            recipes = await context.tools.DB.query(` SELECT * FROM (
                    SELECT *, count(*) OVER() AS count FROM cocktails WHERE  ingredients like ? && id < ? ORDER BY id ASC LIMIT ?
                 ) cocktails ORDER BY id ASC`, [ingri,before, last]);

        }

    }

    if(recipes[0]){

        const countWithoutLimit = recipes[0].count||0;
        let   allCount = await context.tools.DB.query('SELECT count(*) as number FROM cocktails WHERE ingredients like ?',[ingri]);
        const allnumber = allCount[0].number;
        recipes.forEach(cocktail=> {
            cocktail.ingredients = JSON.parse(cocktail['ingredients']);
            cocktail.steps = JSON.parse(cocktail['steps']);
        });
        return{
            edges: recipes.map(recipe=>({
                cursor : recipe.id,
                node: recipe
            })),
            pageInfo:{
                hasNextPage: first ? countWithoutLimit > first : allnumber > countWithoutLimit,
                hasPreviousPage: last ? countWithoutLimit > last : allnumber > countWithoutLimit,
                totalPageCount: Math.ceil(allnumber / (first || last))
            }
        };
    }
    return new UserInputError('no result');
};

const getIngredientWithCategoryPaging = async(args,context)=>{

    const {first, after, last, before, category ,ingredient ,sort} =args;

    if (!first && after) {throw new UserInputError('after must be with first');}
    if ((last && !before) || (!last && before)) {throw new UserInputError('last and before must be used together');}
    if (first && after && last && before) {throw new UserInputError('Incorrect Arguments Usage.');}
    let recipes;
    let ingri = `%${ingredient}%`;
    if(sort === 'DESC'){
        if(first){
            recipes = after
                ? await context.tools.DB.query('SELECT * , count(*) OVER() AS count FROM cocktails WHERE category =? && ingredients like ? && id < ?  ORDER BY id DESC LIMIT ?', [category,ingri,after, first])
                : await context.tools.DB.query('SELECT * , count(*) OVER() AS count FROM cocktails WHERE category =? && ingredients like ? ORDER BY id DESC LIMIT ? ', [ category,ingri,first]);
        }
        if(last){
            recipes = await context.tools.DB.query(` SELECT * FROM (
                    SELECT *, count(*) OVER() AS count FROM cocktails WHERE category =? &&  ingredients like ? && id > ? ORDER BY id DESC LIMIT ?
                 ) cocktails ORDER BY id DESC`, [category,ingri,before, last]);

        }

    }else{

        if(first){
            recipes = after
                ? await context.tools.DB.query('SELECT * , count(*) OVER() AS count FROM cocktails WHERE category =? && ingredients like ? && id > ?  ORDER BY id ASC LIMIT ?', [category,ingri,after, first])
                : await context.tools.DB.query('SELECT * , count(*) OVER() AS count FROM cocktails WHERE category =? && ingredients like ? ORDER BY id ASC LIMIT ? ', [ category,ingri,first]);
        }
        if(last){
            recipes = await context.tools.DB.query(` SELECT * FROM (
                    SELECT *, count(*) OVER() AS count FROM cocktails WHERE category =? &&  ingredients like ? && id < ? ORDER BY id ASC LIMIT ?
                 ) cocktails ORDER BY id ASC`, [category,ingri,before, last]);

        }
    }

    if(recipes[0]){

        const countWithoutLimit = recipes[0].count||0;
        let   allCount = await context.tools.DB.query('SELECT count(*) as number FROM cocktails WHERE category =? && ingredients like ?',[category,ingri]);
        const allnumber = allCount[0].number;
        recipes.forEach(cocktail=> {
            cocktail.ingredients = JSON.parse(cocktail['ingredients']);
            cocktail.steps = JSON.parse(cocktail['steps']);
        });
        return{
            edges: recipes.map(recipe=>({
                cursor : recipe.id,
                node: recipe
            })),
            pageInfo:{
                hasNextPage: first ? countWithoutLimit > first : allnumber > countWithoutLimit,
                hasPreviousPage: last ? countWithoutLimit > last : allnumber > countWithoutLimit,
                totalPageCount: Math.ceil(allnumber / (first || last))
            }
        };
    }
    return new UserInputError('no result');
};

const getCategoryWithAuthorPaging = async(args,context)=>{

    const {first, after, last, before,author ,category,sort} =args;

    if (!first && after) {throw new UserInputError('after must be with first');}
    if ((last && !before) || (!last && before)) {throw new UserInputError('last and before must be used together');}
    if (first && after && last && before) {throw new UserInputError('Incorrect Arguments Usage.');}
    let recipes;

    let auth = `%${author}%`;
    if(sort === 'DESC'){
        if(first){
            recipes = after
                ? await context.tools.DB.query('SELECT * , count(*) OVER() AS count FROM cocktails WHERE category = ? && author like ? && id < ? ORDER BY id DESC LIMIT ?', [category,auth,after, first])
                : await context.tools.DB.query('SELECT * , count(*) OVER() AS count FROM cocktails WHERE category = ? && author like ? ORDER BY id  DESC LIMIT ? ', [ category,auth,first]);
        }
        if(last){
            recipes = await context.tools.DB.query(` SELECT * FROM (
                    SELECT *, count(*) OVER() AS count FROM cocktails WHERE  category = ? && author like ? && id > ? ORDER BY id DESC LIMIT ?
                 ) cocktails ORDER BY id DESC`, [category,auth,before, last]);

        }

    }else{
        if(first){
            recipes = after
                ? await context.tools.DB.query('SELECT * , count(*) OVER() AS count FROM cocktails WHERE category = ? && author like ? && id > ? ORDER BY id LIMIT ?', [category,auth,after, first])
                : await context.tools.DB.query('SELECT * , count(*) OVER() AS count FROM cocktails WHERE category = ? && author like ? ORDER BY id LIMIT ? ', [ category,auth,first]);
        }
        if(last){
            recipes = await context.tools.DB.query(` SELECT * FROM (
                    SELECT *, count(*) OVER() AS count FROM cocktails WHERE  category = ? && author like ? && id < ? ORDER BY id ASC LIMIT ?
                 ) cocktails ORDER BY id `, [category,auth,before, last]);

        }

    }
    if(recipes[0]){

        const countWithoutLimit = recipes[0].count||0;
        let   allCount = await context.tools.DB.query('SELECT count(*) as number FROM cocktails WHERE category = ? && author like ?',[category,auth]);
        const allnumber = allCount[0].number;
        recipes.forEach(cocktail=> {
            cocktail.ingredients = JSON.parse(cocktail['ingredients']);
            cocktail.steps = JSON.parse(cocktail['steps']);
        });
        return{
            edges: recipes.map(recipe=>({
                cursor : recipe.id,
                node: recipe
            })),
            pageInfo:{
                hasNextPage: first ? countWithoutLimit > first : allnumber > countWithoutLimit,
                hasPreviousPage: last ? countWithoutLimit > last : allnumber > countWithoutLimit,
                totalPageCount: Math.ceil(allnumber / (first || last))
            }
        };
    }
    return new UserInputError('no result');
};


module.exports ={

    getRecipesPaging,
    getRecipes,
    getCategoryPaging,
    getAuthorPaging,
    getIngredientPaging,
    getIngredientWithCategoryPaging,
    getCategoryWithAuthorPaging

};