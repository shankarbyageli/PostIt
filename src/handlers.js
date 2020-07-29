const { clientId, clientSecret } = require('../config');
const {
  getUserDetail,
  makeRequest,
  addUserDetails,
  takeMoment,
} = require('./lib');

const getLoggedInDetails = async function (req, res, next) {
  const sessions = req.app.locals.sessions;
  if (sessions[req.cookies.sId] !== undefined) {
    req.user = sessions[req.cookies.sId];
    const userDetails = await req.app.locals.db.getUserById(req.user);
    req.avatar_url = userDetails.avatar_url;
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

const signOut = function (req, res, next) {
  const sessions = req.app.locals.sessions;
  delete sessions[req.cookies.sId];
  res.clearCookie('sId');
  res.redirect('/');
};

const serveDashboard = async function (req, res, next) {
  if (req.user !== undefined) {
    res.render('dashBoard', {
      posts: await req.app.locals.db.getLatestPosts(10),
      avatar_url: req.avatar_url,
      username: req.username,
      takeMoment,
    });
  } else {
    req.url = '/signIn.html';
    next();
  }
};

const serveEditor = async function (req, res) {
  const { id } = req.params;
  if (id == undefined) {
    res.render('editor', {
      data: "{}",
      title_text: "",
      avatar_url: req.avatar_url,
      id: -1
    });
  } else {
    const response = await req.app.locals.db.getPost(id, 0);
    if (response) {
      res.render('editor', {
        data: response.content,
        title_text: response.title,
        avatar_url: req.avatar_url,
        id: response.id,
      });
    }
  }
};

const autoSave = async function (req, res) {
  let id = req.params.id;
  if (id == -1) {
    const postId = await req.app.locals.db.addPost(req.body, req.user);
    id = postId;
  }
  await req.app.locals.db.updatePost(id, req.body);
  res.send(JSON.stringify({ id }));
};

const serveDraftedPosts = async function (req, res) {
  const drafts = await req.app.locals.db.getAllPosts(req.user, 0);
  res.render('posts', { posts: drafts, avatar_url: req.avatar_url, type: 0, takeMoment });
};

const servePublishedPosts = async function (req, res) {
  const published = await req.app.locals.db.getAllPosts(req.user, 1);
  res.render('posts', { posts: published, avatar_url: req.avatar_url, type: 1, takeMoment });
};

const publish = async function (req, res) {
  await req.app.locals.db.publishPost(req.params.id);
  res.send('Published');
};

const getBlog = async function (req, res, next) {
  const { id } = req.params;
  if (!+id) return next();
  const avatar_url = req.user ? req.avatar_url : false;
  const response = await req.app.locals.db.getPost(id, 1);
  if (response) {
    res.render('readBlog', {
      data: response.content,
      title_text: response.title,
      author_avatar: response.avatar_url,
      date: response.last_modified,
      author: response.username,
      avatar_url,
      blog_id: response.id,
    });
  } else {
    next();
  }
};

const serveComments = async function (req, res, next) {
  const { blogId } = req.params;
  const blog = await req.app.locals.db.getPost(blogId, 1);
  const renderOptions = {
    comments: await req.app.locals.db.getComments(blogId),
    title_text: blog.title,
    takeMoment,
  };
  if (req.user) {
    renderOptions.blogId = blogId;
    renderOptions.currentUser = req.username;
    renderOptions.avatar_url = req.avatar_url;
  }
  res.render('comments', renderOptions);
};

const publishComment = function (req, res, next) {
  const { comment, blogId } = req.body;
  const date = new Date().valueOf();
  req.app.locals.db.addComment(comment, blogId, req.user, date);
  res.send('Published Comment');
};

const serveErrorPage = function (req, res) {
  res.status(404);
  res.render('error', { avatar_url: req.avatar_url });
};

const signIn = function (req, res) {
  const params = `client_id=${clientId}&client_secret=${clientSecret}`;
  res.redirect(`https://github.com/login/oauth/authorize?${params}`);
};

const githubCallback = function (req, res) {
  const code = req.url.split('=')[1];
  const params = {
    client_id: clientId,
    client_secret: clientSecret,
    code,
  };
  const url = {
    hostname: 'github.com',
    path: '/login/oauth/access_token',
    method: 'POST',
  };
  makeRequest(url, params)
    .then(getUserDetail)
    .then((details) => addUserDetails(req, details))
    .then((userDetails) => {
      const sId = Date.now();
      req.app.locals.sessions[sId] = userDetails.user_id;
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
  servePublishedPosts
};
