const { UserInputError} = require('apollo-server-express');


const getRecipesPaging = async(args,tools) =>{

    const {first, after, last, before,category} =args;

    if (!first && after) {throw new UserInputError('after must be with first');}
    if ((last && !before) || (!last && before)) {throw new UserInputError('last and before must be used together');}
    if (first && after && last && before) {throw new UserInputError('Incorrect Arguments Usage.');}
    let recipes;
    // DESC
    // if(category){
    //     let cate = `%${category}%`;
    //     if(first){
    //         recipes = after
    //             ? await tools.DB.query('SELECT * , count(*) OVER() AS count FROM cocktails WHERE ingredients like ? && id < ? ORDER BY id DESC LIMIT ?', [cate,after, first])
    //             : await tools.DB.query('SELECT * , count(*) OVER() AS count FROM cocktails WHERE ingredients like ? ORDER BY id DESC LIMIT ? ', [ cate,first]);
    //     }
    //     if(last){
    //         recipes = await tools.DB.query(` SELECT * FROM (
    //             SELECT *, count(*) OVER() AS count FROM cocktails WHERE  ingredients like ? && id > ? ORDER BY id DESC LIMIT ?
    //          ) cocktails ORDER BY id DESC `, [cate,before, last]);

    //     }
    // }else{
    //     if(first){
    //         recipes = after
    //             ? await tools.DB.query('SELECT * , count(*) OVER() AS count FROM cocktails WHERE id < ? ORDER BY id DESC LIMIT ?', [after, first])
    //             : await tools.DB.query('SELECT * , count(*) OVER() AS count FROM cocktails  ORDER BY id DESC LIMIT ? ', [ first]);
    //     }
    //     if(last){
    //         recipes = await tools.DB.query(` SELECT * FROM (
    //             SELECT *, count(*) OVER() AS count FROM cocktails WHERE id > ? ORDER BY id DESC LIMIT ?
    //          ) cocktails ORDER BY id DESC `, [before, last]);
    //     }
    // }

    if(category){
        let cate = `%${category}%`;
        if(first){
            recipes = after
                ? await tools.DB.query('SELECT * , count(*) OVER() AS count FROM cocktails WHERE ingredients like ? && id > ? ORDER BY id LIMIT ?', [cate,after, first])
                : await tools.DB.query('SELECT * , count(*) OVER() AS count FROM cocktails WHERE ingredients like ? ORDER BY id LIMIT ? ', [ cate,first]);
        }
        if(last){
            recipes = await tools.DB.query(` SELECT * FROM (
                SELECT *, count(*) OVER() AS count FROM cocktails WHERE  ingredients like ? && id < ? ORDER BY id ASC LIMIT ?
             ) cocktails ORDER BY id `, [cate,before, last]);

        }
    }else{
        if(first){
            recipes = after
                ? await tools.DB.query('SELECT * , count(*) OVER() AS count FROM cocktails WHERE id > ? ORDER BY id LIMIT ?', [after, first])
                : await tools.DB.query('SELECT * , count(*) OVER() AS count FROM cocktails  ORDER BY id LIMIT ? ', [ first]);
        }
        if(last){
            recipes = await tools.DB.query(` SELECT * FROM (
                SELECT *, count(*) OVER() AS count FROM cocktails WHERE id < ? ORDER BY id ASC LIMIT ?
             ) cocktails ORDER BY id `, [before, last]);
        }
    }
    const countWithoutLimit = recipes[0].count;
    let allCount ;
    if(category){
        let cate = `%${category}%`;
        allCount = await tools.DB.query('SELECT count(*) as number FROM cocktails WHERE ingredients like ?',[cate]);
    }else{
        allCount = await tools.DB.query('SELECT count(*) as number FROM cocktails;');
    }
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

// const getReciep

module.exports ={

    getRecipesPaging,
    getRecipes

};