const express = require('express');
const userRouter = express.Router();

const { publish, ensureLogin, serveEditor } = require('./handlers');

userRouter.use(ensureLogin);
userRouter.use(express.static(`${__dirname}/../public`));
userRouter.get('/editor', serveEditor);
userRouter.post('/publish', publish);

module.exports = { userRouter };
