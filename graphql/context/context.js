const {  PubSub } = require('apollo-server-express');
const pubsub = new PubSub();

const dataloaders = require('../model/dataloders');

const User = require('../model/user_model');
const DB = require('../../utils/mysqlcon');
const moment = require('moment');
const Recipes = require('../model/recipes_model');
const userQuery = require('../model/Query/user_model');

const cocktailQuery = require('../model/Query/cocktail_model');
const userMutation = require('../model/Mutation/userMutation_model');
const cocktailMutaion = require('../model/Mutation/cocktailMutation_model');
const tools = {
    User,
    DB,
    moment,
    Recipes
};


const Mutation ={
    userMutation,
    cocktailMutaion
};
const Query ={
    cocktailQuery,
    userQuery

};


module.exports = ({req})=>{
    if(req){
        return {
            pubsub,
            me : req.id,
            isAuth : req.isAuth,
            req,
            tools,
            startTime: Date.now(),
            dataloaders,
            Query,
            Mutation
        };
    }else{
        return {
            pubsub,
            req,
            tools,
            startTime: Date.now(),


        };}
};

// let context = ({req})=>{
//     if(req){
//         return {
//             pubsub,
//             me : req.id,
//             isAuth : req.isAuth,
//             req,
//             tools,
//             startTime: Date.now(),
//             dataloaders
//         };
//     }else{
//         return {
//             pubsub,
//             req,
//             tools,
//             startTime: Date.now(),


//         };}
// };