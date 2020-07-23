const queryString = require('querystring');
const https = require('https');
const { client_id, client_secret } = require('../config');
const { getUserDetail } = require('./lib');

const isSignedIn = function (req, res, next) {
  const sessions = req.app.locals.sessions;
  if (sessions[req.cookies.sId] !== undefined) {
    req.user = sessions[req.cookies.sId];
    res.send(`Dash board: ${req.user}`);
  }
  req.url = '/signIn.html';
  next();
};

const publish = function (req, res) {};

const signIn = function (req, res) {
  const params = `client_id=${client_id}&client_secret=${client_secret}`;
  res.redirect(`https://github.com/login/oauth/authorize?${params}`);
};

const githubCallback = function (req, res) {
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
      getUserDetail(data);
    });
  });
  httpsReq.end(queryString.stringify(params));
  res.end();
};

module.exports = { isSignedIn, signIn, githubCallback, publish };
