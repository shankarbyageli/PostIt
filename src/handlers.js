const isSignedIn = function (req, res, next) {
  const sessions = req.app.locals.sessions;
  if (sessions[req.cookies.sId] !== undefined) {
    req.user = sessions[req.cookies.sId];
    res.send(`Dash board: ${req.user}`);
  }
  req.url = '/html/signIn.html';
  next();
};

module.exports = { isSignedIn };
