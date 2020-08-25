const { ApolloServer } = require('apollo-server-express');
const http = require('http');

const express = require('express');
require('dotenv').config();
const { PORT , NODE_ENV , PORT_TEST ,} = process.env;
const port = NODE_ENV == 'test' ? PORT_TEST : PORT;
const mock = NODE_ENV == 'development' ? true :false;
const {typeDefs} = require ('./graphql/schema/schema');
const {resolvers} = require('./graphql/resolvers/resolvers');
const app = express();
app.use(express.json());
app.use(express.static('public'));
const isAuth = require('./utils/is-auth');
app.use(isAuth.isAuth);
const context = require('./graphql/context/context');
const subscriptions = require('./graphql/subscriptions/subscriptions');
const depthLimit = require('graphql-depth-limit');
app.use(require('./utils/routes/image_upload'));


const server = new ApolloServer({
    playground : true,
    typeDefs,
    resolvers,
    context,
    mocks: mock,
    subscriptions,
    validationRules: [depthLimit(5)],
    tracing: true
});




server.applyMiddleware({app});

app.get('*', function(req, res){
    if (req.accepts('html')) {
        res.status(400).send('<script>location.href = "/404.html";</script>');
        return;
    }
});


const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);
httpServer.listen(port,() => {
    console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
    console.log(`🚀 Subscriptions ready at ws://localhost:${port}${server.subscriptionsPath}`);
});


module.exports = server;

