
const { AuthenticationError,ForbiddenError, UserInputError,ApolloError} = require('apollo-server-express');



const resolvers = {
    Query: {
        hello: () => 'world',
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
            return context.tools.getRecipes(args,context);

        }  ,
        users :async (parent,args,{tools})=>{
            return  tools.DB.query('select * from user');
        } ,
        reciepesPaging : async (root,args,{tools,pubsub,req})=>{
            pubsub.publish('new_viewer', { newViewer : req.id});
            return tools.getRecipesPaging(args,tools);
        }
    },
    // friendship link
    User : {
        friends : (_,__,___)=>{
            return [ {id:1,email:'123',name:'qs'}, {id:1,email:'123',name:'qs'}, {id:1,email:'123',name:'qs'}];
        }
    },
    Mutation: {
        createCocktail:{

        },
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
                let check = await tools.DB.query('select * from user_cocktail_join where user_id =? and cocktail_id=? ',[me, cocktailId]);
                if(check.length===0&&cocktails.length){
                    try {
                        await tools.DB.transaction();
                        await tools.DB.query('UPDATE cocktails SET likes = IFNULL(likes, 0) +1 WHERE id = ? ', cocktailId);
                        await tools.DB.query('INSERT INTO user_cocktail_join SET ?', [ {user_id:me,cocktail_id:cocktailId}]);
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
                        await tools.DB.query('delete from user_cocktail_join where user_id =? and cocktail_id=?',[me, cocktailId]);
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