module.exports = {
    comments : async (parent,args,context)=>{
        const myComments = await context.dataloaders.userLoaders.userCommentsDataLoader.load(parent.id);
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
        return await context.dataloaders.userLoaders.userSubscriptionsDataLoader.load(parent.id)||[];
    },
    followers : async (parent,args,context)=>{
        return await context.dataloaders.userLoaders.userFollowersDataLoader.load(parent.id)||[];
    },
    likes :async (parent,args,context) =>{
        return await context.dataloaders.userLoaders.userLikesDataLoader.load(parent.id)||[];
    },
    post :async (parent,args,context) =>{
        return await context.dataloaders.userLoaders.userPostsDataLoader.load(parent.id)||[];
    },
    recommend : async (parent,args,context) =>{
        return await context.Query.types.userType.getUserRecommends(parent,context);
    }
};