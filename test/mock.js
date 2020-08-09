const { MockList } = require('apollo-server');

module.exports ={
    Int: () => 6,
    Float: () => 22.1,
    String: () => 'Hello',
    User : () => ({
        post : ()=> new MockList([2,6]),

    })



};