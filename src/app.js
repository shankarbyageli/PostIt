const express = require('express');
const morgan = require('morgan');
const app = express();
const cookieParser = require('cookie-parser');
const { isSignedIn, signIn, githubCallback, publish } = require('./handlers');
app.locals.sessions = {};

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get('/', isSignedIn);
app.use(express.static(`${__dirname}/../public`));
app.get('/signIn', signIn);
app.get('/callback', githubCallback);
app.post('/publish', publish);

module.exports = app;
