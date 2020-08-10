const { clientId, clientSecret } = require('../config');
const lib = require('./lib');
const status = require('./statusCodes');

const isValidRequest = function (req, res, next, id) {
  if (+id) {
    return next();
  }
  res.render('error', {
    avatarUrl: req.session ? req.session.avatarUrl : false,
    userId: req.session ? req.session.userId : false,
  });
};

const getSessionDetails = async function (req, res, next) {
  const sessions = req.app.locals.sessions;
  const userSession = sessions.getSession(req.cookies.sId);
  if (userSession !== undefined) {
    req.session = userSession;
  }
  next();
};

const serveHomepage = async function (req, res) {
  if (req.session !== undefined) {
    res.render('dashBoard', {
      posts: await req.app.locals.db.getLatestPosts(10),
      avatarUrl: req.session.avatarUrl,
      username: req.session.displayName,
      userId: req.session.userId,
      takeMoment: lib.takeMoment,
    });
  } else {
    res.render('signIn', {});
  }
};

const getClapsDetails = async function (req, postId) {
  const clapsCount = (await req.app.locals.db.getClapsCount(postId)).count;
  if (req.session) {
    const isClapped = await req.app.locals.db.isClapped(
      postId,
      req.session.userId
    );
    return { clapsCount, isClapped };
  }
  return { clapsCount, isClapped: null };
};

const getBlog = async function (req, res, next) {
  const { id } = req.params;
  const response = await req.app.locals.db.getPost(id, 1);

  if (response) {
    const clap = await getClapsDetails(req, id);
    const postDetails = await req.app.locals.db.getPostDetails(
      id,
      response.coverImageId
    );

    res.render('readBlog', {
      post: response,
      avatarUrl: req.session ? req.session.avatarUrl : false,
      userId: req.session ? req.session.userId : false,
      coverImage: postDetails.imagePath,
      tags: postDetails.tags,
      clap,
    });
  } else {
    next();
  }
};

const serveComments = async function (req, res, next) {
  const { id } = req.params;
  const blog = await req.app.locals.db.getPost(id, 1);
  if (!blog) {
    return next();
  }
  const renderOptions = {
    comments: await req.app.locals.db.getComments(id),
    titleText: blog.title,
    takeMoment: lib.takeMoment,
    blogId: id,
  };
  if (req.session) {
    renderOptions.userId = req.session.userId;
    renderOptions.currentUser = req.session.displayName;
    renderOptions.avatarUrl = req.session.avatarUrl;
  }
  res.render('comments', renderOptions);
};

const serveErrorPage = function (req, res) {
  res.status(status.NOTFOUND);
  res.render('error', {
    avatarUrl: req.session ? req.session.avatarUrl : false,
    userId: req.session ? req.session.userId : false,
  });
};

const signIn = function (req, res) {
  if (req.session !== undefined) {
    res.redirect('/');
  } else {
    const params = `client_id=${clientId}&client_secret=${clientSecret}`;
    res.redirect(`https://github.com/login/oauth/authorize?${params}`);
  }
};

const fetchUserDetails = (tokenDetails) => {
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
    .then(fetchUserDetails)
    .then((details) => lib.addUserDetails(req, details))
    .then(async (userDetails) => {
      const { userId, username, avatarUrl } = userDetails;
      const sessions = req.app.locals.sessions;
      const displayName = (await req.app.locals.db.getUserById(userId))
        .displayName;
      const sId = await sessions.addSession({
        userId,
        username,
        avatarUrl,
        displayName,
      });
      res.cookie('sId', sId);
      res.redirect('/');
    });
};

module.exports = {
  serveHomepage,
  signIn,
  githubCallback,
  getBlog,
  serveErrorPage,
  getSessionDetails,
  serveComments,
  isValidRequest,
};
