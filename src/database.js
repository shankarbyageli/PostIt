const queries = require('./queries');
class Database {
  constructor(db) {
    this.db = db;
  }

  run(query) {
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

  all(query) {
    return new Promise((resolve, reject) => {
      this.db.all(query, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  get(query) {
    return new Promise((resolve, reject) => {
      this.db.get(query, (err, row) => {
        err && reject(err);
        resolve(row);
      });
    });
  }

  addPost(data, userId) {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run(queries.addPost(userId, data), (err) => {
          if (err) {
            reject(err);
          }
        });
        this.db.get(queries.getAllStories(), (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row.id);
          }
        });
      });
    });
  }

  updatePost(id, data) {
    return this.run(queries.updateStory(id, data));
  }

  publishPost(postId, imageId) {
    return this.run(queries.publishPost(imageId, postId));
  }

  getUsersPosts(userId, postType) {
    return this.all(queries.getUsersPosts(userId, postType));
  }

  getPost(id, postType) {
    return this.get(queries.getPost(id, postType));
  }

  getPostDetails(blogId, imageId) {
    const details = { tags: [] };
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.get(queries.imageQuery(imageId), (err, row) => {
          if (err) {
            reject(err);
          }
          details.imagePath = row.imagePath;
        });

        this.db.all(queries.tagsQuery(blogId), (err, rows) => {
          if (err) {
            reject(err);
          }
          rows.forEach((row) => {
            details.tags.push(row.tag);
          });
          resolve(details);
        });
      });
    });
  }

  getUserById(userId) {
    return this.get(queries.selectUser(userId));
  }

  addUser(userDetails) {
    return this.run(queries.addUser(userDetails));
  }

  getUser(username) {
    const query = 'select * from users where username=?';
    return new Promise((resolve, reject) => {
      this.db.get(query, [username], (err, row) => {
        if (err) {
          reject(err);
        }
        if (row) {
          resolve(row);
        } else {
          resolve(false);
        }
      });
    });
  }

  getComments(blogId) {
    return this.all(queries.getComments(blogId));
  }

  addComment(comment, blogId, userId, date) {
    return this.run(queries.addComment(blogId, userId, date, comment));
  }

  getLatestPosts(count) {
    return this.all(queries.getLatestPosts(count));
  }

  getSearchedPosts(filteringOption, searchedText) {
    const queryString = {
      tag: queries.getPostsByTag(searchedText),
      title: queries.getPostsByTitle(searchedText),
      author: queries.getPostsByAuthor(searchedText),
    };

    return this.all(queryString[filteringOption]);
  }

  addImage(fileName) {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run(queries.insertImage(fileName), (err) => {
          if (err) {
            reject(err);
          }
        });
        this.db.get(queries.selectImages(), (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        });
      });
    });
  }

  addTags(tags, postId) {
    return this.run(queries.addTags(tags, postId));
  }

  deletePost(id) {
    const query = `delete from stories where id = ${id}`;
    return this.run(query);
  }

  isClapped(postId, userId) {
    return new Promise((resolve, reject) => {
      this.db.get(queries.selectClaps(postId, userId), (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  getClapsCount(postId) {
    const query = `
    SELECT count(*) as count from claps 
      WHERE storyId=${postId}
    `;
    return new Promise((resolve, reject) => {
      this.db.get(query, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  clapOnPost(postId, userId) {
    let queryString = queries.insertClap(postId, userId);
    let status = true;
    return new Promise((resolve, reject) => {
      this.isClapped(postId, userId).then((row) => {
        if (row) {
          queryString = queries.deleteClap(postId, userId);
          status = false;
        }
        this.db.run(queryString, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(status);
          }
        });
      });
    });
  }
}

module.exports = Database;
