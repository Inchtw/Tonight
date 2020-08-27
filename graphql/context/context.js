const {PubSub} = require('apollo-server-express');
const pubsub = new PubSub();
const DB = require('../../utils/mysqlcon');
const moment = require('moment');
const userQuery = require('../model/Query/user_model');
const userLoaders = require('../model/Query/dataloaders/user_loaders');
const cocktailLoaders = require('../model/Query/dataloaders/cocktail_loaders');
const userType = require('../model/Query/types/userTypes_model');
const cocktailType = require('../model/Query/types/cocktailType_model');
const cocktailQuery = require('../model/Query/cocktail_model');
const userMutation = require('../model/Mutation/userMutation_model');
const cocktailMutaion = require('../model/Mutation/cocktailMutation_model');
const tools = {
  DB,
  moment,
};

const types = {
  userType,
  cocktailType,
};

const dataloaders = {
  userLoaders,
  cocktailLoaders,
};

const Mutation ={
  userMutation,
  cocktailMutaion,
};

const Query ={
  cocktailQuery,
  userQuery,
  types,
};


module.exports = ({req})=>{
  if (req) {
    return {
      pubsub,
      me: req.id,
      isAuth: req.isAuth,
      req,
      tools,
      startTime: Date.now(),
      dataloaders,
      Query,
      Mutation,
    };
  } else {
    return {
      pubsub,
      req,
      tools,
      startTime: Date.now(),
    };
  }
};
