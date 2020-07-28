const express = require('express');
const userRouter = express.Router();

const {
  publish,
  ensureLogin,
  serveEditor,
  signOut,
  publishComment,
} = require('./handlers');

userRouter.use(ensureLogin);
userRouter.use(express.static(`${__dirname}/../public`));
userRouter.get('/signOut', signOut);
userRouter.get('/editor', serveEditor);
userRouter.post('/publishComment', publishComment);
userRouter.post('/publish', publish);

module.exports = { userRouter };
