/* eslint-disable no-unused-vars */


module.exports = {
  onConnect: (connectionParams, webSocket, context) => {
    console.log('connected');
  },
  onDisconnect: (webSocket, context) => {
    console.log('disconnected');
  },
};
