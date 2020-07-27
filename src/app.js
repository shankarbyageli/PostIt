const express = require('express');
const morgan = require('morgan');
const sqlite = require('sqlite3').verbose();
const Database = require('./database');
const app = express();
const cookieParser = require('cookie-parser');
const { userRouter } = require('./userRouter');
const {
  serveDashboard,
  signIn,
  githubCallback,
  serveErrorPage,
  getBlog,
  ensureLogin,
} = require('./handlers');

const db = new sqlite.Database(`database/${process.env.db}`);

app.locals.sessions = {};
app.locals.db = new Database(db);

app.set('view engine', 'pug');
app.set('views', `${__dirname}/../templates`);
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use('/user', userRouter);
app.get('/blog/:id', getBlog);
app.get('/', serveDashboard);
app.use(express.static(`${__dirname}/../public`));
app.get('/signIn', signIn);
app.get('/callback', githubCallback);
app.use(ensureLogin);
app.use(serveErrorPage);

module.exports = app;
