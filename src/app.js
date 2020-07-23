const express = require('express');
const morgan = require('morgan');
const app = express();
const cookieParser = require('cookie-parser');
const { isSignedIn } = require('./handlers');

app.locals.sessions = {};

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get('/', isSignedIn);
app.use(express.static(`${__dirname}/../public`));

module.exports = app;
