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
  serveDraft,
  followUser,
  serveProfileEditor,
  updateProfile,
  isValidRequest,
  serveClappedPosts,
  serveProfile,
  getFollowers,
} = require('./handlers');

userRouter.use(ensureLogin);
userRouter.use(express.static(`${__dirname}/../public`));

userRouter.get('/signOut', signOut);
userRouter.get('/editor', serveEditor);
userRouter.get('/posts/drafts', serveDraftedPosts);
userRouter.get('/posts/published', servePublishedPosts);
userRouter.post('/publishComment', publishComment);
userRouter.post('/autosave/:id', isValidRequest, autoSave);
userRouter.post('/publish/:id', isValidRequest, publish);
userRouter.get('/draft/:id', isValidRequest, serveDraft);
userRouter.get('/search', serveSearchResults);
userRouter.get('/delete/:id', isValidRequest, deletePost);
userRouter.get('/editProfile', serveProfileEditor);
userRouter.post('/clap/:id', isValidRequest, clapOnPost);
userRouter.post('/follow/:id', isValidRequest, followUser);
userRouter.post('/updateProfile', updateProfile);
userRouter.get('/profile/:id', isValidRequest, serveProfile);
userRouter.get('/profile/:id/followers', isValidRequest, getFollowers);
userRouter.get('/profile/:id/following', isValidRequest, getFollowers);
userRouter.get('/clappedPosts/:userId', serveClappedPosts);

userRouter.use(serveErrorPage);

module.exports = { userRouter };
