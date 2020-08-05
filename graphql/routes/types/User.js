

module.exports = {

    comments : async (parent,args,context)=>{

        // console.log(parent);
        let myComments = await context.dataloaders.userCommentsDataLoader.load(parent.id);
        if(myComments){
            myComments.forEach(comment=> {
                comment.id = parent.id;
                comment.name = parent.name;
                comment.photo = parent.photo;
            });
            return myComments;
        }
        return myComments;
    },
    subscriptions :async (parent,args,context)=>{
        return await context.dataloaders.userSubscriptionsDataLoader.load(parent.id)||[];
    },
    followers : async (parent,args,context)=>{
        return await context.dataloaders.userFollowersDataLoader.load(parent.id)||[];
    },
    likes :async (parent,args,context) =>{
        return await context.dataloaders.userLikesDataLoader.load(parent.id)||[];
    },
    post :async (parent,args,context) =>{
        return await context.dataloaders.userPostsDataLoader.load(parent.id)||[];
    },
    recommend : async (parent,args,context) =>{
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
    }

};