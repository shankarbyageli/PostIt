const express = require('express');
const userRouter = express.Router();

const {
  publish,
  ensureLogin,
  serveEditor,
  signOut,
  publishComment,
  autoSave,
  serveErrorPage,
  serveDraftedPosts
} = require('./handlers');

userRouter.use(ensureLogin);
userRouter.use(express.static(`${__dirname}/../public`));
userRouter.get('/signOut', signOut);
userRouter.get('/editor', serveEditor);
userRouter.get('/posts/drafts', serveDraftedPosts);
userRouter.post('/publishComment', publishComment);
userRouter.post('/autosave/:id', autoSave);
userRouter.post('/publish/:id', publish);
userRouter.use(serveErrorPage);

module.exports = { userRouter };
