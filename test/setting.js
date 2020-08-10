/* eslint-disable no-undef */
require('dotenv').config();
const server = require('../app');
const chai = require('chai');
const {expect} = chai;
const url = 'http://localhost:3001';
const request = require('supertest')(url);
const {truncateFakeData, createFakeData} = require('./fake_data_generator');
const {NODE_ENV} = process.env;
before(async () => {
    if (NODE_ENV !== 'test') {
        throw 'Not in test env';
    }
    await truncateFakeData();
    await createFakeData();

});






module.exports = {
    request,
    expect
};


