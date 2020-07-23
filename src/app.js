const express = require('express');
const morgan = require('morgan');
const sqlite = require('sqlite3');
const Database = require('./database');
const app = express();
const cookieParser = require('cookie-parser');
const { isSignedIn, signIn, githubCallback, publish } = require('./handlers');
app.locals.sessions = {};

const db = new sqlite.Database(`${process.env.db}`);

app.locals.db = new Database(db);
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
