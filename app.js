const {ApolloServer} = require('apollo-server-express');
const http = require('http');

const express = require('express');
require('dotenv').config();

const {PORT, NODE_ENV, PORT_TEST} = process.env;
const port = NODE_ENV == 'test' ? PORT_TEST : PORT;
const mock = NODE_ENV == 'development';
const depthLimit = require('graphql-depth-limit');
const {typeDefs} = require('./graphql/schema/schema');
const {resolvers} = require('./graphql/resolvers/resolvers');

const app = express();
app.use(express.json());
app.use(express.static('public'));
const isAuth = require('./utils/is-auth');

app.use(isAuth.isAuth);
const context = require('./graphql/context/context');
const subscriptions = require('./graphql/subscriptions/subscriptions');
app.use(require('./graphql/routes/image/image_upload'));

const server = new ApolloServer({
  playground: true,
  typeDefs,
  resolvers,
  context,
  mocks: mock,
  subscriptions,
  validationRules: [depthLimit(5)],
  tracing: true,
});

server.applyMiddleware({app});

app.get('*', (req, res) => {
  if (req.accepts('html')) {
    res.status(400).send('<script>location.href = "/404.html";</script>');
  }
});

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);
httpServer.listen(port, () => {
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
  console.log(`🚀 Subscriptions ready at ws://localhost:${port}${server.subscriptionsPath}`);
});

module.exports = server;
