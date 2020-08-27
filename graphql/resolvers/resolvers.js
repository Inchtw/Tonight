
const Query = require('../routes/Query');
const Mutation = require('../routes/Mutation');
const Subscription = require('../routes/Subscription');
const Cocktail = require('../routes/types/Cocktail');
const User = require('../routes/types/User');

const resolvers = {
  Query,
  Cocktail,
  User,
  Mutation,
  Subscription,
};


module.exports ={
  resolvers,
};
