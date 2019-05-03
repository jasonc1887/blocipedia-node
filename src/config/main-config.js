require("dotenv").config();
const express = require('express');
const app = express();
const logger = require('morgan');

module.exports = {
    init(){
       app.use(logger('dev'));
    }
};