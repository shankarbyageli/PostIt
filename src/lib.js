const https = require('https');
const queryString = require('querystring');

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
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve(data.toString()));
    });
    req.end();
  });
};

const makeRequest = function (options, params) {
  return new Promise((resolve, reject) => {
    const request = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        resolve(data.toString());
      });
    });
    request.end(queryString.stringify(params));
  })
};

module.exports = { getUserDetail, makeRequest };
