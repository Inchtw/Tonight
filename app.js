const { ApolloServer } = require('apollo-server-express');
const http = require('http');
const express = require('express');
require('dotenv').config();
const { PORT} = process.env;
const {typeDefs} = require ('./graphql/schema/schema');
// const { resolvers} = require ('./graphql/controllers/resolver');
const {resolvers} = require('./graphql/resolvers/resolvers');
const app = express();
app.use(express.json());
app.use(express.static('public'));
const isAuth = require('./utils/is-auth');
app.use(isAuth.isAuth);
const Upload = require('./utils/photoUpload');
const context = require('./graphql/context/context');
const subscriptions = require('./graphql/subscriptions/subscriptions');
const DB = require('./utils/mysqlcon');

app.post('/headimageload',isAuth.uploadAuth,Upload.myHeadUpload.fields([{ name: 'change_headpic' }]), async(req,res)=>{


    let updateHeadsql = `UPDATE user SET user.photo = "${req.files.change_headpic[0].location}" where user.id = ?`;
    await DB.query(updateHeadsql,req.id);
    res.status(200).json({ url : req.files.change_headpic[0].location });

} );

app.post('/commentimageload',isAuth.uploadAuth,Upload.commentImgUpload.fields([{ name: 'customFile' }]), async(req,res)=>{

    res.status(200).json({ url : req.files.customFile[0].location });

} );


app.post('/imageload',Upload.imageupload.fields([{ name: 'chooseFile' }]), async(req,res)=>{
    res.status(200).json({ url : req.files.chooseFile[0].location });

} );


const server = new ApolloServer({
    playground : true,
    typeDefs,
    resolvers,
    context,
    subscriptions,
    tracing: true
});




server.applyMiddleware({app});

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);
httpServer.listen(PORT,() => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`);
});


