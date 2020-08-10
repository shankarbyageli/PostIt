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
userRouter.get('/search', serveSearchResults);
userRouter.get('/editProfile', serveProfileEditor);

userRouter.post('/publishComment', publishComment);
userRouter.post('/updateProfile', updateProfile);

// userRouter.use(/.*:id.*/, isValidRequest);
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
userRouter.post('/follow/:id', followUser);

userRouter.use(serveErrorPage);

module.exports = { userRouter };
