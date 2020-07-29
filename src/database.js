class Database {
  constructor(db) {
    this.db = db;
  }

  addPost(data, user_id) {
    const query = `INSERT INTO stories (is_published,author_id,title,content,last_modified) values (
      ${0},
      '${user_id}',
      '${data.title}','${JSON.stringify(data.content)}',
      '${data.content.time}');`;
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run(query, (err) => {
          if (err) reject(err);
        });
        this.db.get('select id from stories order by id desc', (err, row) => {
          if (err) reject(err);
          else resolve(row.id);
        });
      });
    });
  }

  updatePost(id, data) {
    const query = `UPDATE stories SET title = '${data.title}', 
      content = '${JSON.stringify(data.content)}',
      last_modified = '${data.content.time}' where id = ${id};`;
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

  publishPost(postId) {
    const query = `UPDATE stories SET is_published = 1 where id = ${postId}`;
    return new Promise((resolve, reject) => {
      this.db.run(query, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  };

  getAllPosts(user_id, post_type) {
    const query = `SELECT * from stories where author_id = ${user_id} AND is_published = ${post_type}`;
    return new Promise((resolve, reject) => {
      this.db.all(query, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      })
    })
  };

  getPost(id, post_type) {
    const query = `
      select * from stories join users on stories.author_id = users.user_id where id = ${id} AND is_published = ${post_type}
      `;
    return new Promise((resolve, reject) => {
      this.db.get(query, (err, row) => {
        err && reject(err);
        resolve(row);
      });
    });
  }

  getUserById(user_id) {
    const query = `select * from users where user_id = ${user_id}`;
    return new Promise((resolve, reject) => {
      this.db.get(query, (err, row) => {
        err && reject(err);
        resolve(row);
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

  getComments(blogId) {
    const query = `select * from comments 
      join users on comments.comment_by = users.user_id
      where comment_on = ${blogId} order by comments.id desc`;
    return new Promise((resolve, reject) => {
      this.db.all(query, async (err, rows) => {
        if (err) {
          reject(err);
        }
        resolve(rows);
      });
    });
  }

  addComment(comment, blogId, userId, date) {
    const query = `INSERT INTO comments 
      (comment_on,comment_by,commented_at,comment) VALUES
      (${blogId},${userId},${date},'${comment}')`;
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

  getLatestPosts = function (count) {
    const query = `select * from stories join users on stories.author_id = users.user_id where is_published = 1 order by stories.id desc limit ${count}`;
    return new Promise((resolve, reject) => {
      this.db.all(query, async (err, rows) => {
        if (err) {
          reject(err);
        }
        resolve(rows);
      });
    });
  };
}

module.exports = Database;
