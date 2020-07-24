class Database {
  constructor(db) {
    this.db = db;
  }

  addPost(data, user_id) {
    const query = `INSERT INTO stories (author_id,title,content,last_modified) values (
      '${user_id}',
      '${data.title}','${JSON.stringify(data.content)}',
      '${data.content.time}');`;
    return new Promise((resolve, reject) => {
      this.db.run(query, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }

  getAvatar(user_id) {
    const query = `select avatar_url from users where user_id = ${user_id}`;
    return new Promise((resolve, reject) => {
      this.db.get(query, (err, rows) => {
        err && reject(err);
        resolve(rows);
      });
    });
  }

  addUser(user_details) {
    const query = `INSERT INTO users (username, avatar_url) values (
      '${user_details.login}', '${user_details.avatar_url}')
    ;`;
    return new Promise((resolve, reject) => {
      this.db.run(query, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }

  execute = function (query) {
    return new Promise(resolve, (reject) => {
      this.db.run(query, (err) => {
        if (err) {
          reject(err);
        }
        resolve(true);
      });
    });
  };

  getUser = function (username) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'select * from users where username=?',
        [username],
        (err, row) => {
          if (err) {
            reject(err);
          }
          if (row) {
            resolve(row);
          } else {
            resolve(false);
          }
        }
      );
    });
  };
}

module.exports = Database;
