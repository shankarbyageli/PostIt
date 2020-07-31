const express = require('express');
const morgan = require('morgan');
const sqlite = require('sqlite3').verbose();
const Database = require('./database');
const app = express();
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const { userRouter } = require('./userRouter');
const {
  serveDashboard,
  signIn,
  githubCallback,
  serveErrorPage,
  getBlog,
  getLoggedInDetails,
  serveComments,
  serveProfile,
} = require('./handlers');

const db = new sqlite.Database(`database/${process.env.db}`);

app.locals.sessions = {};
app.locals.db = new Database(db);

app.set('view engine', 'pug');
app.set('views', `${__dirname}/../templates`);
app.use(fileUpload());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(getLoggedInDetails);
app.use('/user', userRouter);
app.get('/blog/:id', getBlog);
app.get('/', serveDashboard);
app.use(express.static(`${__dirname}/../public`));
app.use('/coverImage', express.static(`${__dirname}/../database/images`));
app.get('/signIn', signIn);
app.get('/callback', githubCallback);
app.get('/comments/:blogId', serveComments);
app.get('/profile/:userId', serveProfile);
app.use(serveErrorPage);

module.exports = app;
