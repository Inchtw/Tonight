

module.exports =  {
    me : async (parent,args,context) => {
        return await context.Query.userQuery.getMyInfo(context);
    },
    cocktails : async (parent,args,context) =>{
        context.pubsub.publish('new_viewer', { newViewer : context.req.id});
        return await context.Query.cocktailQuery.getCocktailRecipe(args,context);

    }  ,
    cocktailThree : async(parent,args,context) =>{
        return await context.Query.cocktailQuery.getThreeSelections(context);

    },
    users :async (parent,args,context)=>{

        return await context.Query.userQuery.getUserInfo(args,context);
    } ,
    reciepesPaging : async (root,args,context)=>{

        return await context.Query.cocktailQuery.getRecipesPaging(args,context);
    },
    categories : async (root,args,context)=>{
        return await context.Query.cocktailQuery.getCategories(context);
    },
};

