const sqlite3 = require('sqlite3');
const express = require('express');
const morgan = require('morgan');
const app = express();
const cookieParser = require('cookie-parser');
const db = new sqlite3.Database(app.locals.db_path);

const { isSignedIn, publish } = require('./handlers');
const Database = require('./database');

app.locals.db = Database(db);
app.locals.sessions = {};

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get('/', isSignedIn);
app.use(express.static(`${__dirname}/../public`));

app.post('/publish', publish);

module.exports = app;
