const express = require('express');
<<<<<<< HEAD
const morgan = require('morgan');
const app = express();
app.use(morgan('dev'));
app.use(express.static('public'));
=======
const cookieParser = require('cookie-parser');
const app = express();
const { isSignedIn } = require('./handlers');

app.locals.sessions = {};
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.get('/', isSignedIn);
app.use(express.static(`${__dirname}/../public`));
>>>>>>> |#2|Shankar/Phaneendra| added signIn.html and handlers for it

module.exports = app;
