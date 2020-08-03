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
  serveDraftedPosts,
  servePublishedPosts,
  serveSearchResults,
  deletePost,
  clapOnPost,
  serveDraft
} = require('./handlers');

userRouter.use(ensureLogin);
userRouter.use(express.static(`${__dirname}/../public`));

userRouter.get('/signOut', signOut);
userRouter.get('/editor', serveEditor);
userRouter.get('/posts/drafts', serveDraftedPosts);
userRouter.get('/posts/published', servePublishedPosts);
userRouter.post('/publishComment', publishComment);
userRouter.post('/autosave/:id', autoSave);
userRouter.post('/publish/:id', publish);
userRouter.get('/draft/:id', serveDraft);
userRouter.get('/search', serveSearchResults);
userRouter.get('/delete/:id', deletePost);
userRouter.post('/clap/:id', clapOnPost);
userRouter.use(serveErrorPage);

module.exports = { userRouter };
