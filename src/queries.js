const addPost = (userId, data) =>
  ` INSERT INTO stories (isPublished,authorId,title,content,lastModified) 
    values ( ${0}, '${userId}','${data.title}',
    '${JSON.stringify(data.content)}', '${data.content.time}');`;

const getAllStories = () => 'select id FROM stories ORDER BY id DESC';

const updatePost = (postId, data) => `
      UPDATE stories SET title = '${data.title}', 
      content = '${JSON.stringify(data.content)}',
      lastModified = '${data.content.time}' where id = ${postId};`;

const publishPost = (imageId, postId) => `UPDATE stories SET isPublished = 1,
     coverImageId = ${imageId} where id = ${postId}`;

const getUsersPosts = (userId, postType) => `
    SELECT * FROM stories
     join users on stories.authorId = users.userId 
     where authorId = ${userId} AND isPublished = ${postType}
     ORDER BY lastModified DESC
    `;

const getPost = (id, postType) => `
      select * FROM stories
       join users on stories.authorId = users.userId
       where id = ${id} AND isPublished = ${postType}
      `;

const imageQuery = (imageId) =>
  `SELECT * FROM images where imageId = ${imageId}`;

const tagsQuery = (blogId) => `SELECT * FROM tags where storyId = ${blogId}`;

const selectUser = (userId) => `select * FROM users where userId = ${userId}`;

const addUser = (userDetails) =>
  `INSERT INTO users (username, avatarUrl,displayName) values (
      '${userDetails.login}', '${userDetails.avatar_url}','${userDetails.login}'
      );`;

const getComments = (blogId) =>
  `select * FROM comments 
      join users on comments.commentBy = users.userId
      where commentOn = ${blogId} ORDER BY comments.id DESC`;

const addComment = (blogId, userId, date, comment) => `INSERT INTO comments 
      (commentOn,commentBy,commentedAt,comment) VALUES
      (${blogId},${userId},${date},'${comment}')`;

const getLatestPosts = (count) => `
    select * FROM stories
     join users on stories.authorId = users.userId 
     join images on stories.coverImageId = images.imageId
     where isPublished = 1 
     ORDER BY stories.id DESC limit ${count}
    `;

const getPostsByTag = (tag) => `
      select * FROM tags
       join stories on tags.storyId = stories.id 
       join users on stories.authorId = users.userId 
       join images on stories.coverImageId = images.imageId
       where isPublished = 1 AND tag like '%${tag}%' 
       ORDER BY lastModified DESC
      `;

const getPostsByTitle = (title) => `
      select * FROM stories
       join users on stories.authorId = users.userId 
       join images on stories.coverImageId = images.imageId
       where isPublished = 1 AND title like '%${title}%' 
       ORDER BY stories.id DESC
      `;

const getPostsByAuthor = (author) => `
      select * FROM stories
       join users on stories.authorId = users.userId 
       join images on stories.coverImageId = images.imageId
       where isPublished = 1 AND username like '%${author}%' 
       ORDER BY lastModified DESC
      `;

const insertImage = (fileName) =>
  `INSERT INTO images (imagePath) VALUES ('${fileName}')`;

const insertClap = (postId, userId) => `INSERT INTO claps 
    VALUES (${postId},${userId})`;

const deleteClap = (postId, userId) => `DELETE FROM claps 
     WHERE storyId=${postId} AND clappedBy=${userId}`;

const selectClaps = (postId, userId) => `SELECT * FROM claps 
    WHERE storyId=${postId} AND clappedBy=${userId}`;

const addTags = (tags, postId) => {
  const values = tags.map((tag) => `(${postId}, '${tag}')`);
  return `INSERT INTO tags VALUES ${values.join(',')}`;
};

const deletePost = (postId) => `DELETE FROM stories 
    WHERE id=${postId}`;

const getUser = (username) => `
    SELECT * FROM users where username='${username}'`;

const getClapsCount = (postId) => `
    SELECT count(*) as count FROM claps WHERE storyId=${postId}`;

const selectImages = () => 'SELECT * FROM images ORDER BY imageId DESC';

const followUser = (userId, followerId) => `
    INSERT INTO followers VALUES (${userId},${followerId})`;

const selectFollowers = (userId, followerId) => `
    SELECT * FROM followers 
    WHERE followerId=${followerId} AND userId=${userId}`;

const unfollowUser = (userId, followerId) => `DELETE FROM followers 
    WHERE followerId=${followerId} AND userId=${userId}`;

const getFollowersCount = (userId) => `
    SELECT count(*) as count FROM followers WHERE userId=${userId}`;

const getFollowers = (userId) => `
    SELECT * FROM followers
    join users on users.userId=followers.userId 
    WHERE followers.userId=${userId}`;

const updateProfile = (userId, displayName) =>
  `UPDATE users SET displayName = '${displayName}' WHERE userId = ${userId}`;

module.exports = {
  addPost,
  getAllStories,
  updatePost,
  publishPost,
  getUsersPosts,
  getPost,
  imageQuery,
  tagsQuery,
  selectUser,
  addUser,
  getComments,
  addComment,
  getLatestPosts,
  getPostsByTag,
  getPostsByTitle,
  getPostsByAuthor,
  insertImage,
  selectImages,
  insertClap,
  deleteClap,
  selectClaps,
  addTags,
  deletePost,
  getUser,
  getClapsCount,
  followUser,
  selectFollowers,
  unfollowUser,
  getFollowersCount,
  getFollowers,
  updateProfile,
};
