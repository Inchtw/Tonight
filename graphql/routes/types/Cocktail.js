




module.exports = {


    likeGivers : async (parent,args,context) =>{
        return await context.dataloaders.cocktailLoaders.cocktailLikersDataLoader.load(parent.id)||[];
    },
    comments : async (parent,args,context) =>{
        return await context.dataloaders.cocktailLoaders.cocktailCommentsDataLoader.load(parent.id)||[];
    },
    recommend : async (parent,args,context) =>{
        return await context.Query.types.cocktailType.getCocktailRecommends(parent,context);

    },
    author : async (parent,args,context) =>{
        let author_info = await context.dataloaders.cocktailLoaders.authorDataLoader.load(parent.author_id);
        return author_info[0];
    }
};