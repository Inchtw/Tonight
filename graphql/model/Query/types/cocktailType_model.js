const getCocktailRecommends = async (parent, context)=>{
  const {id, category} = parent;
  const CocktailRecommend_sql = 'SELECT * From cocktails where category =? && id != ? order by id DESC limit 3 ';
  const recommends = await context.tools.DB.query(CocktailRecommend_sql, [category, id]);
  if (recommends.length<3) {
    const likesRecommend_sql = `SELECT * From cocktails where id != ? order by likes DESC limit ${3-recommends.length} `;
    const likes = await context.tools.DB.query(likesRecommend_sql, [id]);
    return [...recommends, ...likes];
  }
  return recommends;
};


module.exports = {
  getCocktailRecommends
};
