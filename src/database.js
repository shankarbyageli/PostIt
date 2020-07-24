class Database {
  constructor(db) {
    this.db = db;
  }

  addPost(data) {
    const query = `INSERT INTO stories (title,content,last_modified) values (
      '${data.title}','${JSON.stringify(data.content)}',
      '${data.content.time}');`;
    return new Promise((resolve, reject) => {
      this.db.run(query, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      })
    });
  }

  addUser(user_details) {
    const query = `INSERT INTO users (username, avatar_url) values (
      '${user_details.login}', '${user_details.avatar_url}')
    ;`
    return new Promise((resolve, reject) => {
      this.db.run(query, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      })
    });
  }

  isUserExists() {
    return new Promise((resolve, reject) => {
      resolve(false);
    })
  }
}

module.exports = Database;
