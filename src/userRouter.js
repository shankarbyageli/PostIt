const express = require('express');
const userRouter = express.Router();

const { errorHandler, serveErrorPage, isValidRequest } = require('./handlers');

const {
  publish,
  ensureLogin,
  signOut,
  serveDraftedPosts,
  servePublishedPosts,
  serveSearchResults,
  deletePost,
  clapOnPost,
  serveDraft,
  followUser,
  serveProfileEditor,
  updateProfile,
  serveClappedPosts,
  serveProfile,
  getFollowers,
  getRespondedPosts,
  serveEditor,
  publishComment,
  autoSave,
} = require('./userHandlers');

userRouter.use(ensureLogin);
userRouter.use(express.static(`${__dirname}/../public`));

userRouter.get('/signOut', signOut);
userRouter.get('/editor', serveEditor);
userRouter.get('/posts/drafts', serveDraftedPosts);
userRouter.get('/posts/published', servePublishedPosts);
userRouter.get('/search', serveSearchResults);
userRouter.get('/editProfile', serveProfileEditor);

userRouter.post('/publishComment', publishComment);
userRouter.post('/updateProfile', updateProfile);

userRouter.param('id', isValidRequest);

userRouter.get('/draft/:id', serveDraft);
userRouter.get('/delete/:id', deletePost);
userRouter.get('/clappedPosts/:id', serveClappedPosts);
userRouter.get('/profile/:id/comments', getRespondedPosts);
userRouter.get('/profile/:id', serveProfile);
userRouter.get('/profile/:id/followers', getFollowers);
userRouter.get('/profile/:id/following', getFollowers);

userRouter.post('/autosave/:id', autoSave);
userRouter.post('/publish/:id', publish);
userRouter.post('/clap/:id', clapOnPost);
userRouter.get('/follow/:id', followUser);

userRouter.use(errorHandler);
userRouter.use(serveErrorPage);

module.exports = { userRouter };
