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

  async publishPost(postId, tags, imagePath) {
    const [coverImageId] = await this.newDb('images').insert({ imagePath });
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
    return new Promise((resolve, reject) => {
      this.newDb('stories')
        .select('*')
        .join('users', { 'stories.authorId': 'users.userId' })
        .where({ isPublished: postType, authorId: userId })
        .orderBy('lastModified', 'desc')
        .then((data) => {
          resolve(data);
        })
        .catch(reject);
    });
  }

  getPost(id, postType) {
    return new Promise((resolve, reject) => {
      this.newDb('stories')
        .select('*')
        .join('users', { 'stories.authorId': 'users.userId' })
        .where({ isPublished: postType, id })
        .first()
        .then(resolve)
        .catch(reject);
    });
  }

  async getPostDetails(storyId, imageId) {
    const details = { tags: [] };
    await this.newDb('images')
      .select('*')
      .where({ imageId })
      .then(([data]) => {
        details.imagePath = data.imagePath;
      });

    return new Promise((resolve, reject) => {
      this.newDb('tags')
        .select('*')
        .where({ storyId })
        .then((rows) => {
          rows.forEach((row) => {
            details.tags.push(row.tag);
          });
          resolve(details);
        })
        .catch(reject);
    });
  }

  getUserById(userId) {
    return new Promise((resolve, reject) => {
      this.newDb('users')
        .select('*')
        .where({ userId })
        .first()
        .then(resolve)
        .catch(reject);
    });
  }

  addUser(userDetails) {
    return new Promise((resolve, reject) => {
      this.newDb('users')
        .insert({
          username: userDetails.login,
          avatarUrl: userDetails.avatar_url,
          displayName: userDetails.login,
        })
        .then(() => resolve(true))
        .catch(reject);
    });
  }

  getUser(username) {
    return new Promise((resolve, reject) => {
      this.newDb('users')
        .select('*')
        .where({ username })
        .first()
        .then(resolve)
        .catch(reject);
    });
  }

  getComments(storyId) {
    return new Promise((resolve, reject) => {
      this.newDb('comments')
        .select('*')
        .join('users', { 'comments.commentBy': 'users.userId' })
        .where({ commentOn: storyId })
        .orderBy('id', 'desc')
        .then((data) => resolve(data))
        .catch(reject);
    });
  }

  addComment(comment, blogId, userId, date) {
    return new Promise((resolve, reject) => {
      this.newDb('comments')
        .insert({
          commentOn: blogId,
          commentBy: userId,
          commentedAt: date,
          comment,
        })
        .then(() => resolve(true))
        .catch(reject);
    });
  }

  getLatestPosts(count) {
    return new Promise((resolve, reject) => {
      this.newDb('stories')
        .select('*')
        .join('users', { 'stories.authorId': 'users.userId' })
        .join('images', { 'stories.coverImageId': 'images.imageId' })
        .where({ isPublished: 1 })
        .orderBy('lastModified', 'desc')
        .limit(count)
        .then(resolve)
        .catch(reject);
    });
  }

  getSearchedPosts(filteringOption, searchedText) {
    const queryString = {
      tag: this.getPostsByTag.bind(this),
      title: this.getPostsByTitle.bind(this),
      author: this.getPostsByAuthor.bind(this),
    };
    return new Promise((resolve, reject) => {
      if (!queryString[filteringOption]) {
        reject('error');
      }
      queryString[filteringOption](searchedText).then(resolve).catch(reject);
    });
  }

  getPostsByTag(tag) {
    return new Promise((resolve, reject) => {
      this.newDb('tags')
        .select('*')
        .join('stories', { 'tags.storyId': 'stories.id' })
        .join('users', { 'stories.authorId': 'users.userId' })
        .join('images', { 'stories.coverImageId': 'images.imageId' })
        .where({ isPublished: 1 })
        .where('tag', 'like', `%${tag}%`)
        .orderBy('lastModified', 'desc')
        .then(resolve)
        .catch(reject);
    });
  }

  getPostsByTitle(title) {
    return new Promise((resolve, reject) => {
      this.newDb('stories')
        .select('*')
        .join('users', { 'stories.authorId': 'users.userId' })
        .join('images', { 'stories.coverImageId': 'images.imageId' })
        .where({ isPublished: 1 })
        .where('title', 'like', `%${title}%`)
        .orderBy('id', 'desc')
        .then(resolve)
        .catch(reject);
    });
  }

  getPostsByAuthor(author) {
    return new Promise((resolve, reject) => {
      this.newDb('stories')
        .select('*')
        .join('users', { 'stories.authorId': 'users.userId' })
        .join('images', { 'stories.coverImageId': 'images.imageId' })
        .where({ isPublished: 1 })
        .where('username', 'like', `%${author}%`)
        .orderBy('id', 'desc')
        .then(resolve)
        .catch(reject);
    });
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
