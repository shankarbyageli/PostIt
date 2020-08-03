const fs = require('fs');
const { clientId, clientSecret } = require('../config');
const lib = require('./lib');

const getSessionDetails = async function (req, res, next) {
  const sessions = req.app.locals.sessions;
  const userSession = sessions.getSession(req.cookies.sId);
  if (userSession !== undefined) {
    req.session = userSession;
  }
  next();
};

const ensureLogin = async function (req, res, next) {
  if (req.session !== undefined) {
    next();
  } else {
    res.redirect('/');
  }
};

const signOut = function (req, res) {
  const sessions = req.app.locals.sessions;
  sessions.removeSession(req.cookies.sId);
  res.clearCookie('sId');
  res.redirect('/');
};

const serveHomepage = async function (req, res) {
  if (req.session !== undefined) {
    res.render('dashBoard', {
      posts: await req.app.locals.db.getLatestPosts(10),
      avatarUrl: req.session.avatarUrl,
      username: req.session.username,
      takeMoment: lib.takeMoment,
    });
  } else {
    res.render('signIn', {});
  }
};

const serveDraft = async function (req, res, next) {
  const { id } = req.params;
  if (!+id) {
    return next();
  }
  const response = await req.app.locals.db.getPost(id, 0);
  if (response) {
    res.render('editor', {
      data: response.content,
      titleText: response.title,
      avatarUrl: req.session.avatarUrl,
      id: response.id,
    });
  } else {
    next();
  }
};

const serveEditor = async function (req, res) {
  res.render('editor', {
    data: '{}',
    titleText: '',
    avatarUrl: req.session.avatarUrl,
    id: -1,
  });
};

const autoSave = async function (req, res) {
  let { id } = req.params;
  if (+id === -1) {
    id = await req.app.locals.db.addPost(req.body, req.session.userId);
  } else {
    await req.app.locals.db.updatePost(id, req.body);
  }
  res.send(JSON.stringify({ id }));
};

const serveDraftedPosts = async function (req, res) {
  const drafts =
    await req.app.locals.db.getUsersPosts(req.session.userId, 0);
  res.render('posts', {
    posts: drafts,
    avatarUrl: req.session.avatarUrl,
    type: 0,
    takeMoment: lib.takeMoment,
  });
};

const servePublishedPosts = async function (req, res) {
  const published =
    await req.app.locals.db.getUsersPosts(req.session.userId, 1);
  res.render('posts', {
    posts: published,
    avatarUrl: req.session.avatarUrl,
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
  res.status(200).end();
};

const getClapsDetails = async function (req, postId) {
  const clapsCount = (await req.app.locals.db.getClapsCount(postId)).count;
  if (req.session) {
    const isClapped =
      await req.app.locals.db.isClapped(postId, req.session.userId);
    return { clapsCount, isClapped };
  }
  return { clapsCount, isClapped: null };
};

const getBlog = async function (req, res, next) {
  const { id } = req.params;
  if (!+id) {
    return next();
  }
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
      coverImage: postDetails.imagePath,
      tags: postDetails.tags,
      clap,
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
  const posts = await req.app.locals.db.getUsersPosts(userId, 1);
  res.render('userProfile', {
    posts,
    avatarUrl: req.session ? req.session.avatarUrl : false,
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
    userId: req.session.user,
    takeMoment: lib.takeMoment,
    blogId,
  };
  if (req.session) {
    renderOptions.currentUser = req.session.username;
    renderOptions.avatarUrl = req.session.avatarUrl;
  }
  res.render('comments', renderOptions);
};

const publishComment = async function (req, res) {
  const { comment, blogId } = req.body;
  const date = new Date().valueOf();
  await req.app.locals.db.addComment(comment, blogId, req.session.userId, date);
  res.status(200).end();
};

const serveErrorPage = function (req, res) {
  res.status(404);
  res.render(
    'error',
    { avatarUrl: req.session ? req.session.avatarUrl : false }
  );
};

const signIn = function (req, res) {
  if (req.session !== undefined) {
    res.redirect('/');
  } else {
    const params = `client_id=${clientId}&client_secret=${clientSecret}`;
    res.redirect(`https://github.com/login/oauth/authorize?${params}`);
  }
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
    .then(async (userDetails) => {
      const { userId, username, avatarUrl } = userDetails;
      const sessions = req.app.locals.sessions;
      const sId = await sessions.addSession({ userId, username, avatarUrl });
      res.cookie('sId', sId);
      res.redirect('/');
    });
};

const deletePost = async function (req, res, next) {
  const { id } = req.params;
  if (!+id) {
    return next();
  }
  await req.app.locals.db.deletePost(id);
  res.redirect(req.headers.referer);
};

const clapOnPost = async function (req, res, next) {
  const { id } = req.params;
  if (!+id) {
    return next();
  }
  const status = await req.app.locals.db.clapOnPost(id, req.session.userId);
  const clapsCount = (await req.app.locals.db.getClapsCount(id)).count;
  res.send({ clapped: status, clapsCount });
};

module.exports = {
  serveHomepage,
  signIn,
  githubCallback,
  publish,
  ensureLogin,
  serveEditor,
  getBlog,
  serveErrorPage,
  getSessionDetails,
  signOut,
  serveComments,
  publishComment,
  autoSave,
  serveDraftedPosts,
  servePublishedPosts,
  serveProfile,
  serveSearchResults,
  deletePost,
  clapOnPost,
  serveDraft
};
