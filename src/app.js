const express = require('express');
const morgan = require('morgan');
const sqlite = require('sqlite3');
const Database = require('./database');
const app = express();
const cookieParser = require('cookie-parser');
const {
  serveDashboard,
  signIn,
  githubCallback,
  ensureLogin,
} = require('./handlers');
const { userRouter } = require('./userRouter');
const db = new sqlite.Database(`${process.env.db}`);

app.locals.sessions = {};
app.locals.db = new Database(db);

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use('/user', userRouter);
app.get('/', serveDashboard);
app.use(express.static(`${__dirname}/../public`));
app.get('/signIn', signIn);
app.get('/callback', githubCallback);

module.exports = app;
