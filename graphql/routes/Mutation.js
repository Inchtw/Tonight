

module.exports = {
    createCocktail:async(parent,args,context)=>{
        return await context.Mutation.cocktailMutaion.createCocktail(args,context);
    }
    ,
    createUser:async (parent,args,context)=>{
        const userdata = await context.Mutation.userMutation.signUp(args,context) ;
        context.pubsub.publish('NewUser', { newUser: userdata.user });
        return userdata.user;
    },
    login: async (parent,args,context)=>{
        return await context.Mutation.userMutation.signIn(args,context) ;
    },
    commentCocktail : async (parent,args,context)=>{

        return await context.Mutation.cocktailMutaion.commentCocktail(args,context);
    }
    ,
    likeCocktail:async (parent,args,context)=>{
        return await context.Mutation.cocktailMutaion.likeCocktail(args,context);

    },
    subscribeAuthor:async (parent,args,context)=>{

        return await context.Mutation.userMutation.subscribeAuthor(args,context);
    }
};