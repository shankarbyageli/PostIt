const crypto = require('crypto');

const getSessionId = function () {
  const iterations = 1000;
  const keyLen = 5,
    radix = 36,
    bytes = 16;
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(
      Date.now().toString(radix),
      crypto.randomBytes(bytes),
      iterations,
      keyLen,
      'sha1',
      (err, derivedKey) => {
        if (err) {
          reject(err);
        }
        resolve(derivedKey.toString('hex'));
      }
    );
  });
};

class Sessions {
  constructor(sessions) {
    this.sessions = sessions;
  }

  async addSession(sessionDetails) {
    const sessionId = await getSessionId();
    this.sessions[sessionId] = { ...sessionDetails };
    return sessionId;
  }

  getSession(sessionId) {
    return this.sessions[sessionId];
  }

  removeSession(sessionId) {
    if (this.sessions[sessionId]) {
      delete this.sessions[sessionId];
      return true;
    }
    return false;
  }
}

module.exports = Sessions;
