const queryString = require('querystring');
const https = require('https');
const { client_id, client_secret } = require('../config');
const { getUserDetail } = require('./lib');
const app = require('./app');

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

const serveDashboard = function (req, res, next) {
  const sessions = req.app.locals.sessions;
  if (sessions[req.cookies.sId] !== undefined) {
    req.user = sessions[req.cookies.sId];
    res.send(`Dash board: ${req.user}`);
  } else {
    req.url = '/signIn.html';
    next();
  }
};

const publish = function (req, res) {
  req.app.locals.db.addPost(req.body);
  res.send('Published');
};

const signIn = function (req, res) {
  const params = `client_id=${client_id}&client_secret=${client_secret}`;
  res.redirect(`https://github.com/login/oauth/authorize?${params}`);
};

const githubCallback = function (req, resp) {
  const code = req.url.split('=')[1];
  const params = {
    client_id,
    client_secret,
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
        req.app.locals.db.getUser(user.login).then((user) => {
          const sId = Date.now();
          if (user) {
            req.app.locals.sessions[sId] = user.user_id;
            resp.cookie('sId', user.user_id);
            resp.redirect('/');
          } else {
            req.app.locals.db.addUser(user.login, user.avatar_url).then(() => {
              req.app.locals.db.getUser(user.login).then((user) => {
                req.app.locals.sessions[sId] = user.user_id;
                resp.cookie('sId', user.user_id);
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
};
