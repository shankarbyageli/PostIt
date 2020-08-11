const queries = require('./queries');

class Database {
  constructor(db, newDb) {
    this.db = db;
    this.newDb = newDb;
  }

  run(query) {
    return new Promise((resolve, reject) => {
      this.db.run(query, (err) => {
        if (err) {
          reject(err);
        }
        resolve(true);
      });
    });
  }

  all(query) {
    return new Promise((resolve, reject) => {
      this.db.all(query, (err, rows) => {
        if (err) {
          reject(err);
        }
        resolve(rows);
      });
    });
  }

  get(query) {
    return new Promise((resolve, reject) => {
      this.db.get(query, (err, row) => {
        if (err) {
          reject(err);
        }
        resolve(row);
      });
    });
  }

  addPost(data, userId) {
    return new Promise((resolve, reject) => {
      this.newDb('stories')
        .insert({
          authorId: userId,
          title: data.title,
          content: JSON.stringify(data.content),
          lastModified: data.content.time,
        })
        .then(([draftId]) => resolve(draftId))
        .catch(reject);
    });
  }

  updatePost(postId, data) {
    return new Promise((resolve, reject) => {
      this.newDb('stories')
        .update({
          title: data.title,
          content: data.content,
          lastModified: data.content.time,
        })
        .where({ id: postId })
        .then(() => resolve(true))
        .catch(reject);
    });
  }

  // publishPost(postId, tags, imagePath) {
  //   return new Promise((resolve, reject) => {
  //     const dbInstance = this;
  //     this.db.run(queries.insertImage(imagePath), async function (err) {
  //       if (err) {
  //         reject(err);
  //       }
  //       if (tags.length) {
  //         await dbInstance.addTags(tags, postId);
  //       }
  //       const lastId = this.lastID; // eslint-disable-line
  //       dbInstance.db.run(queries.publishPost(lastId, postId), (err) => {
  //         if (err) {
  //           reject(err);
  //         }
  //         resolve(true);
  //       });
  //     });
  //   });
  // }

  async publishPost(postId, tags, imagePath) {
    const [coverImageId] = await this.newDb('images').insert(imagePath);
    if (tags.length) {
      await this.addTags(tags, postId);
    }
    return new Promise((resolve, reject) => {
      this.newDb('stories')
        .update({ isPublished: 1, coverImageId })
        .where({ id: postId })
        .then(() => resolve(true))
        .catch(reject);
    });
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
    return new Promise((resolve, reject) => {
      this.db.get(queries.getUser(username), (err, row) => {
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

  addTags(tags, storyId) {
    const fields = tags.map((tag) => {
      return { tag, storyId };
    });
    return new Promise((resolve, reject) => {
      this.newDb('tags')
        .insert(fields)
        .then(() => resolve(true))
        .catch(reject);
    });
  }

  deletePost(postId) {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db
          .run('PRAGMA foreign_keys = ON;')
          .run(queries.deletePost(postId), (err) => {
            if (err) {
              reject(err);
            }
            resolve(true);
          });
      });
    });
  }

  isClapped(postId, userId) {
    return new Promise((resolve, reject) => {
      this.db.get(queries.selectClaps(postId, userId), (err, row) => {
        if (err) {
          reject(err);
        }
        if (row) {
          resolve(true);
        }
        resolve(false);
      });
    });
  }

  isFollowing(userId, followerId) {
    return new Promise((resolve, reject) => {
      this.db.get(queries.selectFollowers(userId, followerId), (err, row) => {
        if (err) {
          reject(err);
        }
        if (row) {
          resolve(true);
        }
        resolve(false);
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

  getClapsCount(postId) {
    return this.get(queries.getClapsCount(postId));
  }

  getFollowersCount(userId) {
    return this.get(queries.getFollowersCount(userId));
  }

  getFollowingCount(userId) {
    return this.get(queries.getFollowingCount(userId));
  }

  followUser(userId, followerId) {
    let queryString = queries.followUser(userId, followerId);
    let status = true;
    return new Promise((resolve, reject) => {
      this.isFollowing(userId, followerId).then((row) => {
        if (row) {
          queryString = queries.unfollowUser(userId, followerId);
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

  getFollowers(userId) {
    return this.all(queries.getFollowers(userId));
  }

  async updateProfile(userId, userDetails) {
    if (userDetails.avatarUrl) {
      await this.run(queries.updateAvatar(userId, userDetails.avatarUrl));
    }
    return this.run(queries.updateDisplayName(userId, userDetails.displayName));
  }

  getFollowing(userId) {
    return this.all(queries.getFollowing(userId));
  }

  getClappedPosts(userId) {
    return this.all(queries.getClappedPosts(userId));
  }

  getCommentedPosts(userId) {
    return this.all(queries.getCommentedPosts(userId));
  }

  destroy() {
    this.newDb.destroy();
  }
}

module.exports = Database;
