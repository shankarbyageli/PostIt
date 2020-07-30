const https = require('https');
const queryString = require('querystring');
const moment = require('moment');

const takeMoment = function (date) {
  return moment(date).fromNow();
};

const addUserDetails = async function (req, details) {
  const user = JSON.parse(details);
  let userDetails = await req.app.locals.db.getUser(user.login);
  if (!userDetails) {
    await req.app.locals.db.addUser(user);
    userDetails = await req.app.locals.db.getUser(user.login);
  }
  return userDetails;
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
  });
};

module.exports = { makeRequest, addUserDetails, takeMoment };
