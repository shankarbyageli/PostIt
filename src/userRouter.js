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
  getRespondedPosts,
} = require('./handlers');

userRouter.use(ensureLogin);
userRouter.use(express.static(`${__dirname}/../public`));

userRouter.get('/signOut', signOut);
userRouter.get('/editor', serveEditor);
userRouter.get('/posts/drafts', serveDraftedPosts);
userRouter.get('/posts/published', servePublishedPosts);
userRouter.get('/draft/:id', isValidRequest, serveDraft);
userRouter.get('/search', serveSearchResults);
userRouter.get('/delete/:id', isValidRequest, deletePost);
userRouter.get('/editProfile', serveProfileEditor);
userRouter.get('/clappedPosts/:userId', serveClappedPosts);
userRouter.get('/profile/:id/comments', isValidRequest, getRespondedPosts);
userRouter.get('/profile/:id', isValidRequest, serveProfile);
userRouter.get('/profile/:id/followers', isValidRequest, getFollowers);
userRouter.get('/profile/:id/following', isValidRequest, getFollowers);

userRouter.post('/publishComment', publishComment);
userRouter.post('/autosave/:id', isValidRequest, autoSave);
userRouter.post('/publish/:id', isValidRequest, publish);
userRouter.post('/clap/:id', isValidRequest, clapOnPost);
userRouter.post('/follow/:id', isValidRequest, followUser);
userRouter.post('/updateProfile', updateProfile);

userRouter.use(serveErrorPage);

module.exports = { userRouter };
