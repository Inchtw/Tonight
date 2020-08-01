
const { AuthenticationError,ForbiddenError, UserInputError,ApolloError} = require('apollo-server-express');
const { KnownTypeNamesRule } = require('graphql');



const resolvers = {
    Query: {
        me : async (parent,args,{tools,me}) => {
            if(me){
                let myinfo = await tools.DB.query('select * from user where id=?',[me]);

                return myinfo[0];
            }
            else{
                throw new AuthenticationError('Need login!');
            }
        },
        cocktails : async (parent,args,context) =>{

            return await context.tools.Recipes.getRecipes(args,context);

        }  ,
        cocktailThree : async(parent,args,context) =>{
            let hots_sql = 'select * from cocktails order by views DESC limit 3 ';
            let tops_sql = 'select * from cocktails order by likes DESC limit 3 ';
            let news_sql = 'select * from cocktails order by id DESC limit 3 ';
            // let rank_sql = 'select cocktails.* ,comments.rank from cocktails  left join comments on comments.cocktail_id = cocktails.id order by comments.rank DESC limit 3;';
            let hots = await context.tools.DB.query(hots_sql);
            let tops = await context.tools.DB.query(tops_sql);
            let news = await context.tools.DB.query(news_sql);
            // let ranks = await context.tools.DB.query(rank_sql);
            //may need to update rank in database each time
            // let Array = [...hots,...tops,...news];
            // Array.forEach(cocktail=> {
            //     cocktail.ingredients = JSON.parse(cocktail['ingredients']);
            //     cocktail.steps = JSON.parse(cocktail['steps']);
            // });
            // console.log({hots,tops,news});
            return {hots,tops,news};

        },
        users :async (parent,args,context)=>{

            return  context.tools.DB.query('select id, name ,photo  from user where id =?', [args.id]);
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
        },
        categories : async (root,args,context)=>{
            let categories =  await context.tools.DB.query('SELECT DISTINCT category FROM cocktails;');


            let category = await categories .map(e=>{

                return   e.category;

            });

            return category;
        },
    },
    User : {
        friends : (_,__,___)=>{
            return [ {id:1,email:'123',name:'qs'}, {id:1,email:'123',name:'qs'}, {id:1,email:'123',name:'qs'}];
        },
        comments : async (parent,args,context)=>{
            let {id,name,photo } = parent;
            let myComment_sql = 'SELECT * FROM tonight.comments where user_id =? order by id DESC';

            let myComments = await context.tools.DB.query(myComment_sql,[id]);
            myComments.forEach(comment=> {
                comment.id = id;
                comment.name = name;
                comment.photo = photo;
            });
            return myComments;
        },
        subscriptions :(parent,args,context)=>{
            let {id } = parent;
            let mySub_sql = `SELECT  id, name ,photo  FROM user
            where id in   (select author_id from user_subscribe_join where user_subscribe_join.user_id= ? order by id DESC) `;
            return context.tools.DB.query(mySub_sql,[id]);
        },
        followers : (parent,args,context)=>{
            let {id } = parent;
            let mySub_sql = `SELECT  id, name ,photo  FROM user
            where id in   (select user_id from user_subscribe_join where user_subscribe_join.author_id=  ? order by id DESC) `;
            return context.tools.DB.query(mySub_sql,[id]);

        },
        likes :async (parent,args,context) =>{
            let {id } = parent;
            let mylikes_sql = `SELECT * , cocktails.id as LIKE_ID
            FROM cocktails
            INNER JOIN  user_like_join
            ON user_like_join.cocktail_id=cocktails.id
            where user_like_join.user_id= ? order by LIKE_ID DESC `;
            let a = await context.tools.DB.query(mylikes_sql,[id]);
            // console.log(id);
            a.forEach(e=>{
                e.id = e.LIKE_ID;
            });
            // console.log(a);
            return a;

        },
        post :async (parent,args,context) =>{
            let {id } = parent;
            let mepost_sql = `SELECT *
            FROM cocktails
           where author_id =? order by id DESC `;
            let myrecipes = await context.tools.DB.query(mepost_sql,[id]);
            myrecipes.forEach(cocktail=> {
                cocktail.ingredients = JSON.parse(cocktail['ingredients']);
                cocktail.steps = JSON.parse(cocktail['steps']);
            });
            return myrecipes;
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
        },


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
            let CocktailComment_sql = `SELECT user.id , user.name , user.photo , comments.img ,comments.comment ,comments.rank ,comments.title
            FROM comments
            inner Join  user
            ON user.id=comments.user_id
            where cocktail_id =? order by comments.id Desc`;
            return context.tools.DB.query(CocktailComment_sql,[id]);
        },
        // ranking :  async (parent,args,context) =>{
        //     let {id } = parent;
        //     let Cocktail_Rank_sql = 'SELECT SUM(comments.rank) / count(*) AS ranking from comments where cocktail_id = ?';
        //     let rank  = await context.tools.DB.query(Cocktail_Rank_sql,[id]);
        //     return  +rank[0].ranking;
        // },
        recommend : async (parent,args,context) =>{
            let {id ,category , resource , author  } = parent;
            let Cocktail_recommend_sql = 'SELECT * From cocktails where category =? && id != ? order by id DESC limit 3 ';

            let cate = await context.tools.DB.query(Cocktail_recommend_sql,[category,id]);
            if(cate.length<3){
                let likes_recommend_sql = `SELECT * From cocktails where id != ? order by likes DESC limit ${3-cate.length} `;
                let likes = await context.tools.DB.query(likes_recommend_sql,[id]);
                return [...cate, ...likes];
            }
            return cate;
            // if(cate.length<3){
            //     let Author_recommend_sql = `SELECT * From cocktails where author =? && id != ? order by id DESC limit ${3-cate.length} `;
            //     let auth = await context.tools.DB.query(Author_recommend_sql,[author,id]);
            //     return [...cate, ...auth];
            // }
        },
        author : async (parent,args,context) =>{
            let {author_id } = parent;
            let Cocktail_Author_sql = 'SELECT id, name, photo,intro From user where id = ? ';
            let author_info = await context.tools.DB.query(Cocktail_Author_sql,[author_id]);
            // console.log(args.author);
            return author_info[0];

            // if(cate.length<3){
            //     let Author_recommend_sql = `SELECT * From cocktails where author =? && id != ? order by id DESC limit ${3-cate.length} `;
            //     let auth = await context.tools.DB.query(Author_recommend_sql,[author,id]);
            //     return [...cate, ...auth];
            // }
        }


    },
    Mutation: {
        createCocktail:async(parent,args,context)=>{
            // console.log(args);

            // need to rewrite
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
        commentCocktail : async (parent,args,context)=>{

            return await context.tools.User.commentCocktail(args,context);
        }
        ,
        likeCocktail:async (parent,{likeInput},{me,tools})=>{
            if(me){
                let cocktails = await tools.DB.query('select * from cocktails where id =? ',likeInput.id);
                let check = await tools.DB.query('select * from user_like_join where user_id =? and cocktail_id=? ',[me, likeInput.id]);
                if(check.length===0&&cocktails.length){
                    try {
                        await tools.DB.transaction();
                        await tools.DB.query('UPDATE cocktails SET likes = IFNULL(likes, 0) +1 WHERE id = ? ', likeInput.id);
                        await tools.DB.query('INSERT INTO user_like_join SET ?', [ {user_id:me,cocktail_id:likeInput.id}]);
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
                        await tools.DB.query('UPDATE cocktails SET likes = likes -1 WHERE id = ? ', likeInput.id);
                        await tools.DB.query('delete from user_like_join where user_id =? and cocktail_id=?',[me, likeInput.id]);
                        await tools.DB.commit();
                        return false;
                    } catch (error) {
                        console.log(error);
                        await tools.DB.rollback();
                        return {error};
                    }
                }
                throw new ApolloError('Wrong Cocktail id!');

            }
            throw new ApolloError('Need Login to like!');
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
                throw new ApolloError('Wrong author id!');

            }
            throw new ApolloError('Need Login to subscribe!');
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