
const { AuthenticationError,ForbiddenError, UserInputError,ApolloError} = require('apollo-server-express');



const resolvers = {
    Query: {
        me : async (parent,args,{tools,me}) => {
            if(me){
                let myinfo = await tools.DB.query('select * from user where id=?',[me]);
                return myinfo[0];
            }
            else{
                throw new AuthenticationError('need login');
            }
        },
        cocktails : (parent,args,context) =>{
            return context.tools.Recipes.getRecipes(args,context);

        }  ,
        users :async (parent,args,{tools})=>{
            return  tools.DB.query('select * from user');
        } ,
        reciepesPaging : async (root,args,context)=>{
            if(args.category&&args.ingredient){
                return context.tools.Recipes.getIngredientWithCategoryPaging(args,context);
            }
            if(args.category&&args.author){
                return context.tools.Recipes.getCategoryWithAuthorPaging(args,context);
            }
            if(args.category){
                return context.tools.Recipes.getCategoryPaging(args,context);
            }
            if(args.author){
                return context.tools.Recipes.getAuthorPaging(args,context);
            }
            if(args.ingredient){
                return context.tools.Recipes.getIngredientPaging(args,context);
            }

            context.pubsub.publish('new_viewer', { newViewer : context.req.id});
            return context.tools.Recipes.getRecipesPaging(args,context.tools);
        }
    },
    // friendship link
    User : {
        friends : (_,__,___)=>{
            return [ {id:1,email:'123',name:'qs'}, {id:1,email:'123',name:'qs'}, {id:1,email:'123',name:'qs'}];
        },
        comments : async (parent,args,context)=>{
            console.log(parent);
            let {id,name,photo } = parent;
            let myComment_sql = 'SELECT * FROM tonight.comments where user_id =?';

            let myComments = await context.tools.DB.query(myComment_sql,[id]);
            myComments.forEach(comment=> {
                comment.id = id;
                comment.name = name;
                comment.photo = photo;
            });
            console.log(myComments);
            return myComments;
        },
        subsriptions :(parent,args,context)=>{
            let {id } = parent;
            let mySub_sql = `SELECT  id, name ,photo  FROM user
            where id in   (select author_id from user_subscribe_join where user_subscribe_join.user_id= ?) `;
            return context.tools.DB.query(mySub_sql,[id]);


        },
        followers : (parent,args,context)=>{
            let {id } = parent;
            let mySub_sql = `SELECT  id, name ,photo  FROM user
            where id in   (select user_id from user_subscribe_join where user_subscribe_join.author_id=  ?) `;
            return context.tools.DB.query(mySub_sql,[id]);

        },
        likes :(parent,args,context) =>{
            let {id } = parent;
            let mylikes_sql = `SELECT *
            FROM cocktails
            INNER JOIN  user_like_join
            ON user_like_join.cocktail_id=cocktails.id
            where user_like_join.user_id= ? `;

            return context.tools.DB.query(mylikes_sql,[id]);

        },
        post :async (parent,args,context) =>{
            let {id } = parent;
            let mepost_sql = `SELECT *
            FROM cocktails
           where author_id =? `;
            let myrecipes = await context.tools.DB.query(mepost_sql,[id]);
            myrecipes.forEach(cocktail=> {
                cocktail.ingredients = JSON.parse(cocktail['ingredients']);
                cocktail.steps = JSON.parse(cocktail['steps']);
            });
            return myrecipes;
        }

    },
    Cocktail:{
        likeGivers : async (parent,args,context) =>{
            let {id } = parent;
            let like_giver_sql = `SELECT id,name,photo
            FROM user
           where id in  (select user_id from user_like_join where user_like_join.cocktail_id=  ?) `;
            return context.tools.DB.query(like_giver_sql,[id]);
        },
        comments : async (parent,args,context) =>{
            let {id } = parent;
            let CocktailComment_sql = `SELECT user.id , user.name , user.photo , comments.img ,comments.comment ,comments.rank
            FROM comments
            inner Join  user
            ON user.id=comments.user_id
            where cocktail_id =?`;
            return context.tools.DB.query(CocktailComment_sql,[id]);
        },
        ranking :  async (parent,args,context) =>{
            let {id } = parent;
            let Cocktail_Rank_sql = 'SELECT SUM(comments.rank) / count(*) AS ranking from comments where cocktail_id = ?';
            let rank  = await context.tools.DB.query(Cocktail_Rank_sql,[id]);
            return  +rank[0].ranking;
        },

    },
    Mutation: {
        createCocktail:async(parent,args,context)=>{
            console.log(args);
            // console.log(context);
            return await context.tools.User.createCocktail(args,context);
        }
        ,
        createUser:async (parent,args,{tools,pubsub})=>{
            const userdata = await tools.User.signUp(args) ;
            pubsub.publish('NewUser', { newUser: userdata.user });
            return userdata.user;
        },
        login: (parent,args,{tools})=>{
            return tools.User.signIn(args) ;
        },
        updateMyInfo:async (parent,args)=>{
            console.log(args.updateMyInfoInput);
        },
        likeCocktail:async (parent,{cocktailId},{me,tools})=>{
            if(me){
                let cocktails = await tools.DB.query('select * from cocktails where id =? ',cocktailId);
                let check = await tools.DB.query('select * from user_like_join where user_id =? and cocktail_id=? ',[me, cocktailId]);
                if(check.length===0&&cocktails.length){
                    try {
                        await tools.DB.transaction();
                        await tools.DB.query('UPDATE cocktails SET likes = IFNULL(likes, 0) +1 WHERE id = ? ', cocktailId);
                        await tools.DB.query('INSERT INTO user_like_join SET ?', [ {user_id:me,cocktail_id:cocktailId}]);
                        await tools.DB.commit();
                        return cocktails[0];
                    } catch (error) {
                        console.log(error);
                        await tools.DB.rollback();
                        return {error};
                    }
                }else if(check.length>0){
                    try {
                        await tools.DB.transaction();
                        await tools.DB.query('UPDATE cocktails SET likes = likes -1 WHERE id = ? ', cocktailId);
                        await tools.DB.query('delete from user_like_join where user_id =? and cocktail_id=?',[me, cocktailId]);
                        await tools.DB.commit();
                        return cocktails[0];
                    } catch (error) {
                        console.log(error);
                        await tools.DB.rollback();
                        return {error};
                    }
                }
                throw new ApolloError('wrong cocktail id');

            }
            throw new ApolloError('need login');
        },
        subscribeAuthor:async (parent,{SubscribeInput},{me,tools})=>{
            if(me){
                let users = await tools.DB.query('select * from user where id =? ',SubscribeInput.id);
                let check = await tools.DB.query('select * from user_subscribe_join where user_id =? and author_id=? ',[me, SubscribeInput.id]);
                if(check.length===0&&users.length){
                    try {
                        await tools.DB.transaction();
                        await tools.DB.query('INSERT INTO user_subscribe_join SET ?', [ {user_id:me,author_id:SubscribeInput.id}]);
                        await tools.DB.commit();
                        return true;
                    } catch (error) {
                        console.log(error);
                        await tools.DB.rollback();
                        return {error};
                    }
                }else if(check.length>0){
                    try {
                        await tools.DB.transaction();
                        await tools.DB.query('delete from user_subscribe_join where user_id =? and author_id=?',[me, SubscribeInput.id]);
                        await tools.DB.commit();
                        return false;
                    } catch (error) {
                        console.log(error);
                        await tools.DB.rollback();
                        return {error};
                    }
                }
                throw new ApolloError('wrong author id');

            }
            throw new ApolloError('need login');
        }
    },
    Subscription :{
        newUser : {
            subscribe :  async (parent,args,{ pubsub})=>{
                return pubsub.asyncIterator('NewUser');
            }
        },
        newViewer:{
            subscribe :  async(parent,args,{ pubsub})=>{
                return await pubsub.asyncIterator('new_viewer');
            }
        }
    }
};
module.exports ={
    resolvers

};