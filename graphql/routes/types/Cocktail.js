




module.exports = {


    likeGivers : async (parent,args,context) =>{
        return await context.dataloaders.cocktailLikersDataLoader.load(parent.id)||[];
    },
    comments : async (parent,args,context) =>{
        return await context.dataloaders.cocktailCommentsDataLoader.load(parent.id)||[];
    },
    recommend : async (parent,args,context) =>{
        let {id ,category  } = parent;
        let Cocktail_recommend_sql = 'SELECT * From cocktails where category =? && id != ? order by id DESC limit 3 ';

        let cate = await context.tools.DB.query(Cocktail_recommend_sql,[category,id]);
        if(cate.length<3){
            let likes_recommend_sql = `SELECT * From cocktails where id != ? order by likes DESC limit ${3-cate.length} `;
            let likes = await context.tools.DB.query(likes_recommend_sql,[id]);
            return [...cate, ...likes];
        }
        return cate;
    },
    author : async (parent,args,context) =>{
        let author_info = await context.dataloaders.authorDataLoader.load(parent.author_id);
        return author_info[0];
    }
};