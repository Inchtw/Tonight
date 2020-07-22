const { ApolloServer, PubSub } = require('apollo-server-express');
const http = require('http');
const express = require('express');
const tools = require('./graphql/route/context');
require('dotenv').config();
const { PORT} = process.env;
const pubsub = new PubSub();
const {typeDefs} = require ('./graphql/schema/schema');
const { resolvers} = require ('./graphql/controller/resolver');
const app = express();
app.use(express.json());
app.use(express.static('public'));
const isAuth = require('./utils/is-auth');
app.use(isAuth);
const socketio = require('socket.io');
const imageupload = require('./utils/photoUpload');
const DataLoader = require('dataloader');




app.post('/imageload',imageupload.fields([{ name: 'chooseFile' }]), async(req,res)=>{
    res.status(200).json({ url : req.files.chooseFile[0].location });

} );


const server = new ApolloServer({
    playground : true,
    typeDefs,
    resolvers,
    subscriptions: {
        onConnect: (connectionParams, webSocket, context) => {
            console.log('connected');
        },
        onDisconnect: (webSocket, context) => {
            console.log('disconnected');
        },
    },
    context: ({req})=>{
        if(req){
            return {
                pubsub,
                me : req.id,
                isAuth : req.isAuth,
                req,
                tools,
                startTime: Date.now(),
            };
        }else{
            return {
                pubsub,
                req,
                tools,
                startTime: Date.now(),

            };}
    },
    tracing: true
});

server.applyMiddleware({app});

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);
httpServer.listen(PORT,() => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`);
});

const io = socketio(httpServer);
io.on('connection',(socket)=>{
    console.log('connected to socket');
});
