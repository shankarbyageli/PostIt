const express = require('express');
const userRouter = express.Router();

const {
  publish,
  ensureLogin,
  serveEditor,
  signOut,
  publishComment,
  autoSave
} = require('./handlers');

userRouter.use(ensureLogin);
userRouter.use(express.static(`${__dirname}/../public`));
userRouter.get('/signOut', signOut);
userRouter.get('/editor', serveEditor);
userRouter.post('/publishComment', publishComment);
userRouter.post('/autosave/:id', autoSave);
userRouter.post('/publish/:id', publish);

module.exports = { userRouter };
