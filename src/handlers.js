const queryString = require('querystring');
const https = require('https');
const { clientId, clientSecret } = require('../config');
const { getUserDetail } = require('./lib');

const ensureLogin = function (req, res, next) {
  const sessions = req.app.locals.sessions;
  if (sessions[req.cookies.sId] !== undefined) {
    req.user = sessions[req.cookies.sId];
    next();
  } else {
    req.url = '/signIn.html';
    next();
  }
};

const serveDashboard = async function (req, res, next) {
  const sessions = req.app.locals.sessions;
  if (sessions[req.cookies.sId] !== undefined) {
    req.user = sessions[req.cookies.sId];
    const { avatar_url, username } = await req.app.locals.db.getUserById(
      req.user
    );
    res.render('dashBoard', {
      posts: await req.app.locals.db.getLatestPosts(10),
      avatar_url,
      username,
    });
  } else {
    req.url = '/signIn.html';
    next();
  }
};

const serveEditor = function (req, res) {
  req.app.locals.db.getUserById(req.user).then(({ avatar_url }) => {
    res.render('editor', { avatar_url });
  });
};

const publish = function (req, res) {
  req.app.locals.db.addPost(req.body, req.user);
  res.send('Published');
};

const getBlog = async function (req, res, next) {
  const { id } = req.params;
  if (!+id) return next();
  const user_id = req.app.locals.sessions[req.cookies.sId];
  const avatar_url = user_id
    ? (await req.app.locals.db.getUserById(user_id)).avatar_url
    : false;
  const response = await req.app.locals.db.getPost(id);
  if (response) {
    res.render('readBlog', {
      data: response.content,
      title_text: response.title,
      avatar_url,
    });
  } else {
    next();
  }
};

const serveErrorPage = function (req, res) {
  res.status(404);
  res.render('error');
};

const signIn = function (req, res) {
  const params = `client_id=${clientId}&client_secret=${clientSecret}`;
  res.redirect(`https://github.com/login/oauth/authorize?${params}`);
};

const githubCallback = function (req, resp) {
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
  const httpsReq = https.request(url, (res) => {
    let data = '';
    res.on('data', (chunk) => (data += chunk));
    res.on('end', () => {
      getUserDetail(data.toString()).then((details) => {
        const user = JSON.parse(details);
        req.app.locals.db.getUser(user.login).then((userDetails) => {
          const sId = Date.now();
          if (userDetails) {
            req.app.locals.sessions[sId] = userDetails.user_id;
            resp.cookie('sId', sId);
            resp.redirect('/');
          } else {
            req.app.locals.db.addUser(user).then(() => {
              req.app.locals.db.getUser(user.login).then((userDetails) => {
                req.app.locals.sessions[sId] = userDetails.user_id;
                resp.cookie('sId', sId);
                resp.redirect('/');
              });
            });
          }
        });
      });
    });
  });
  httpsReq.end(queryString.stringify(params));
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
};
