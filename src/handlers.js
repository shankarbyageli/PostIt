const fs = require('fs');
const { clientId, clientSecret } = require('../config');
const lib = require('./lib');

const getLoggedInDetails = async function (req, res, next) {
  const sessions = req.app.locals.sessions;
  if (sessions[req.cookies.sId] !== undefined) {
    req.user = sessions[req.cookies.sId];
    const userDetails = await req.app.locals.db.getUserById(req.user);
    req.avatarUrl = userDetails.avatarUrl;
    req.username = userDetails.username;
  }
  next();
};

const ensureLogin = async function (req, res, next) {
  if (req.user !== undefined) {
    next();
  } else {
    res.redirect('/');
  }
};

const signOut = function (req, res) {
  const sessions = req.app.locals.sessions;
  delete sessions[req.cookies.sId];
  res.clearCookie('sId');
  res.redirect('/');
};

const serveDashboard = async function (req, res, next) {
  if (req.user !== undefined) {
    res.render('dashBoard', {
      posts: await req.app.locals.db.getLatestPosts(10),
      avatarUrl: req.avatarUrl,
      username: req.username,
      takeMoment: lib.takeMoment,
    });
  } else {
    req.url = '/signIn.html';
    next();
  }
};

const serveEditor = async function (req, res, next) {
  const { id } = req.params;
  if (id === undefined) {
    res.render('editor', {
      data: '{}',
      titleText: '',
      avatarUrl: req.avatarUrl,
      id: -1,
    });
  } else {
    const response = await req.app.locals.db.getPost(id, 0);
    if (response) {
      res.render('editor', {
        data: response.content,
        titleText: response.title,
        avatarUrl: req.avatarUrl,
        id: response.id,
      });
    } else {
      next();
    }
  }
};

const autoSave = async function (req, res) {
  let id = req.params.id;
  if (+id === -1) {
    const postId = await req.app.locals.db.addPost(req.body, req.user);
    id = postId;
  }
  await req.app.locals.db.updatePost(id, req.body);
  res.send(JSON.stringify({ id }));
};

const serveDraftedPosts = async function (req, res) {
  const drafts = await req.app.locals.db.getAllPosts(req.user, 0);
  res.render('posts', {
    posts: drafts,
    avatarUrl: req.avatarUrl,
    type: 0,
    takeMoment: lib.takeMoment,
  });
};

const servePublishedPosts = async function (req, res) {
  const published = await req.app.locals.db.getAllPosts(req.user, 1);
  res.render('posts', {
    posts: published,
    avatarUrl: req.avatarUrl,
    type: 1,
    takeMoment: lib.takeMoment,
  });
};

const publish = async function (req, res) {
  const coverImage = req.files && req.files.file;
  let imageDetails = { imageId: null };
  if (coverImage) {
    fs.writeFileSync(
      `${__dirname}/../database/images/${coverImage.md5}`,
      coverImage.data
    );
    imageDetails = await req.app.locals.db.addImage(coverImage.md5);
  }
  const tags = JSON.parse(req.body.tags);
  if (tags.length) {
    await req.app.locals.db.addTags(tags, req.params.id);
  }
  await req.app.locals.db.publishPost(req.params.id, imageDetails.imageId);
  res.send('Published');
};

const getBlog = async function (req, res, next) {
  const { id } = req.params;
  if (!+id) {
    return next();
  }
  const avatarUrl = req.user ? req.avatarUrl : false;
  const response = await req.app.locals.db.getPost(id, 1);
  if (response) {
    res.render('readBlog', {
      post: response,
      avatarUrl,
    });
  } else {
    next();
  }
};

const serveProfile = async function (req, res, next) {
  const { userId } = req.params;
  if (!+userId) {
    return next();
  }
  const userDetails = await req.app.locals.db.getUserById(userId);
  if (!userDetails) {
    return next();
  }
  const posts = await req.app.locals.db.getAllPosts(userId, 1);
  res.render('userProfile', {
    posts,
    avatarUrl: req.avatarUrl,
    authorAvatar: userDetails.avatarUrl,
    username: userDetails.username,
    takeMoment: lib.takeMoment,
  });
};

const serveSearchResults = async function (req, res) {
  const { filter, searchText } = req.query;
  const posts = await req.app.locals.db.getSearchedPosts(filter, searchText);
  res.send({ posts });
};

const serveComments = async function (req, res, next) {
  const { blogId } = req.params;
  const blog = await req.app.locals.db.getPost(blogId, 1);
  if (!blog) {
    return next();
  }
  const renderOptions = {
    comments: await req.app.locals.db.getComments(blogId),
    titleText: blog.title,
    userId: req.user,
    takeMoment: lib.takeMoment,
    blogId,
  };
  if (req.user) {
    renderOptions.currentUser = req.username;
    renderOptions.avatarUrl = req.avatarUrl;
  }
  res.render('comments', renderOptions);
};

const publishComment = function (req, res) {
  const { comment, blogId } = req.body;
  const date = new Date().valueOf();
  req.app.locals.db.addComment(comment, blogId, req.user, date);
  res.send('Published Comment');
};

const serveErrorPage = function (req, res) {
  res.status(404);
  res.render('error', { avatarUrl: req.avatarUrl });
};

const signIn = function (req, res) {
  const params = `client_id=${clientId}&client_secret=${clientSecret}`;
  res.redirect(`https://github.com/login/oauth/authorize?${params}`);
};

const getUserDetail = (tokenDetails) => {
  const token = tokenDetails.split('&')[0].split('=')[1];
  const options = {
    hostname: 'api.github.com',
    path: '/user',
    headers: {
      'user-agent': 'node.js',
      Authorization: `token ${token}`,
    },
  };
  return lib.makeRequest(options, {});
};

const githubCallback = function (req, res) {
  const code = req.url.split('=')[1];
  const params = {
    client_id: clientId, // eslint-disable-line
    client_secret: clientSecret, // eslint-disable-line
    code,
  };
  const url = {
    hostname: 'github.com',
    path: '/login/oauth/access_token',
    method: 'POST',
  };
  lib
    .makeRequest(url, params)
    .then(getUserDetail)
    .then((details) => lib.addUserDetails(req, details))
    .then((userDetails) => {
      const sId = Date.now();
      req.app.locals.sessions[sId] = userDetails.userId;
      res.cookie('sId', sId);
      res.redirect('/');
    });
};

module.exports = {
  serveDashboard,
  signIn,
  githubCallback,
  publish,
  ensureLogin,
  serveEditor,
  getBlog,
  serveErrorPage,
  getLoggedInDetails,
  signOut,
  serveComments,
  publishComment,
  autoSave,
  serveDraftedPosts,
  servePublishedPosts,
  serveProfile,
  serveSearchResults,
};
