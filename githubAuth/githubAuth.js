const express = require('express');
const queryString = require('querystring');
const https = require('https');
const app = express();

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
  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => (data += chunk));
    res.on('end', () => console.log(data.toString()));
  });
  req.end();
};

app.get('/', (req, res) => {
  const params =
    `client_id=${process.env.client_id}&client_secret=${process.env.client_secret}`;
  res.redirect(`https://github.com/login/oauth/authorize?${params}`);
});

app.get('/login', (req, res) => {
  const code = req.url.split('=')[1];
  const params = {
    client_id: process.env.client_id,
    client_secret: process.env.client_secret,
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
});

app.listen(8000, () => console.log('app is listening on 8000'));

