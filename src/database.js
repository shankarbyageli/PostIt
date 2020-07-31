const { query } = require('express');

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
    const query = `
    INSERT INTO stories (isPublished,authorId,title,content,lastModified) 
    values (
      ${0},
      '${userId}',
      '${data.title}','${JSON.stringify(data.content)}',
      '${data.content.time}'
    );`;
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run(query, (err) => {
          if (err) {
            reject(err);
          }
        });
        this.db.get('select id from stories order by id desc', (err, row) => {
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
    const query = `UPDATE stories SET title = '${data.title}', 
      content = '${JSON.stringify(data.content)}',
      lastModified = '${data.content.time}' where id = ${id};`;
    return this.run(query);
  }

  publishPost(postId, imageId) {
    const query = `UPDATE stories SET isPublished = 1,
     coverImageId = ${imageId} where id = ${postId}`;
    return this.run(query);
  }

  getAllPosts(userId, postType) {
    const query = `
    SELECT * from stories
     join users on stories.authorId = users.userId 
     where authorId = ${userId} AND isPublished = ${postType}
     order by lastModified desc
    `;
    return this.all(query);
  }

  getPost(id, postType) {
    const query = `
      select * from stories
       join users on stories.authorId = users.userId
       where id = ${id} AND isPublished = ${postType}
      `;
    return this.get(query);
  }

  getPostDetails(blogId, imageId) {
    const imageQuery = `SELECT * FROM images where imageId = ${imageId}`;
    const tagsQuery = `SELECT * FROM tags where storyId = ${blogId}`;
    const details = { tags: [] };
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.get(imageQuery, (err, row) => {
          if (err) {
            reject(err);
          }
          details.imagePath = row.imagePath;
        });

        this.db.all(tagsQuery, (err, rows) => {
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
    const query = `select * from users where userId = ${userId}`;
    return this.get(query);
  }

  addUser(userDetails) {
    const query = `INSERT INTO users (username, avatarUrl) values (
      '${userDetails.login}', '${userDetails.avatar_url}')
    ;`;
    return this.run(query);
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
    const query = `select * from comments 
      join users on comments.commentBy = users.userId
      where commentOn = ${blogId} order by comments.id desc`;
    return this.all(query);
  }

  addComment(comment, blogId, userId, date) {
    const query = `INSERT INTO comments 
      (commentOn,commentBy,commentedAt,comment) VALUES
      (${blogId},${userId},${date},'${comment}')`;
    return this.run(query);
  }

  getLatestPosts(count) {
    const query = `
    select * from stories
     join users on stories.authorId = users.userId 
     join images on stories.coverImageId = images.imageId
     where isPublished = 1 
     order by stories.id desc limit ${count}
    `;
    return this.all(query);
  }

  getSearchedPosts(filteringOption, searchedText) {
    const query = {
      tag: `
      select * from tags
       join stories on tags.storyId = stories.id 
       join users on stories.authorId = users.userId 
       join images on stories.coverImageId = images.imageId
       where isPublished = 1 AND tag like '%${searchedText}%' 
       order by lastModified desc
      `,
      title: `
      select * from stories
       join users on stories.authorId = users.userId 
       join images on stories.coverImageId = images.imageId
       where isPublished = 1 AND title like '%${searchedText}%' 
       order by stories.id desc
      `,
      author: `
      select * from stories
       join users on stories.authorId = users.userId 
       join images on stories.coverImageId = images.imageId
       where isPublished = 1 AND username like '%${searchedText}%' 
       order by lastModified desc
      `,
    };

    return this.all(query[filteringOption]);
  }

  addImage(fileName) {
    const query = `INSERT INTO images (imagePath) VALUES ('${fileName}')`;
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run(query, (err) => {
          if (err) {
            reject(err);
          }
        });
        this.db.get(
          'select * from images order by imageId desc',
          (err, row) => {
            if (err) {
              reject(err);
            } else {
              resolve(row);
            }
          }
        );
      });
    });
  }

  addTags(tags, postId) {
    const values = tags.map((tag) => `(${postId}, '${tag}')`);
    const query = `INSERT INTO tags VALUES ${values.join(',')}`;
    return this.run(query);
  }

  deletePost(id) {
    const query = `delete from stories where id = ${id}`;
    return this.run(query);
  }

  isClapped(postId, userId) {
    const query = `SELECT * from claps 
    WHERE storyId=${postId} AND clappedBy=${userId}`;
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
    let query = `INSERT INTO claps 
    VALUES (${postId},${userId})`;
    let status = true;
    return new Promise((resolve, reject) => {
      this.isClapped(postId, userId).then((row) => {
        if (row) {
          query = `DELETE from claps 
            WHERE storyId=${postId} AND clappedBy=${userId}`;
          status = false;
        }
        this.db.run(query, (err) => {
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
