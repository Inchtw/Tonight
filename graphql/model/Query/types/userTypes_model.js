const getUserRecommends = async(parent,context)=>{
    let {id } = parent;
    let my_like_suggest = `select * from cocktails where category  in (SELECT category
        FROM cocktails
        INNER JOIN  user_like_join
        ON user_like_join.cocktail_id=cocktails.id
        where user_like_join.user_id= ? )  order by likes desc limit 3;`;
    let mysuggest = await context.tools.DB.query(my_like_suggest,[id]);
    if(mysuggest.length<3){
        let likes_suggest = `select * from cocktails order by likes desc limit ${3-mysuggest.length};`;
        let likesuggest = await context.tools.DB.query(likes_suggest);
        let combine = [...mysuggest, ...likesuggest];
        combine.forEach(cocktail=> {
            cocktail.ingredients = JSON.parse(cocktail['ingredients']);
            cocktail.steps = JSON.parse(cocktail['steps']);
        });
        return combine;
    }
    mysuggest.forEach(cocktail=> {
        cocktail.ingredients = JSON.parse(cocktail['ingredients']);
        cocktail.steps = JSON.parse(cocktail['steps']);
    });
    return mysuggest;
};


module.exports = {
    getUserRecommends

};