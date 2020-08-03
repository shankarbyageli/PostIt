const addPost = (userId, data) =>
  ` INSERT INTO stories (isPublished,authorId,title,content,lastModified) 
    values ( ${0}, '${userId}','${data.title}',
    '${JSON.stringify(data.content)}', '${data.content.time}');`;

const getAllStories = () => 'select id from stories order by id desc';

const updatePost = (postId, data) => `
      UPDATE stories SET title = '${data.title}', 
      content = '${JSON.stringify(data.content)}',
      lastModified = '${data.content.time}' where id = ${postId};`;

const publishPost = (imageId, postId) => `UPDATE stories SET isPublished = 1,
     coverImageId = ${imageId} where id = ${postId}`;

const getUsersPosts = (userId, postType) => `
    SELECT * from stories
     join users on stories.authorId = users.userId 
     where authorId = ${userId} AND isPublished = ${postType}
     order by lastModified desc
    `;

const getPost = (id, postType) => `
      select * from stories
       join users on stories.authorId = users.userId
       where id = ${id} AND isPublished = ${postType}
      `;

const imageQuery = (imageId) =>
  `SELECT * FROM images where imageId = ${imageId}`;

const tagsQuery = (blogId) => `SELECT * FROM tags where storyId = ${blogId}`;

const selectUser = (userId) => `select * from users where userId = ${userId}`;

const addUser = (userDetails) =>
  `INSERT INTO users (username, avatarUrl) values (
      '${userDetails.login}', '${userDetails.avatar_url}')
    ;`;

const getComments = (blogId) =>
  `select * from comments 
      join users on comments.commentBy = users.userId
      where commentOn = ${blogId} order by comments.id desc`;

const addComment = (blogId, userId, date, comment) => `INSERT INTO comments 
      (commentOn,commentBy,commentedAt,comment) VALUES
      (${blogId},${userId},${date},'${comment}')`;

const getLatestPosts = (count) => `
    select * from stories
     join users on stories.authorId = users.userId 
     join images on stories.coverImageId = images.imageId
     where isPublished = 1 
     order by stories.id desc limit ${count}
    `;

const getPostsByTag = (tag) => `
      select * from tags
       join stories on tags.storyId = stories.id 
       join users on stories.authorId = users.userId 
       join images on stories.coverImageId = images.imageId
       where isPublished = 1 AND tag like '%${tag}%' 
       order by lastModified desc
      `;

const getPostsByTitle = (title) => `
      select * from stories
       join users on stories.authorId = users.userId 
       join images on stories.coverImageId = images.imageId
       where isPublished = 1 AND title like '%${title}%' 
       order by stories.id desc
      `;

const getPostsByAuthor = (author) => `
      select * from stories
       join users on stories.authorId = users.userId 
       join images on stories.coverImageId = images.imageId
       where isPublished = 1 AND username like '%${author}%' 
       order by lastModified desc
      `;

const insertImage = (fileName) =>
  `INSERT INTO images (imagePath) VALUES ('${fileName}')`;

const insertClap = (postId, userId) => `INSERT INTO claps 
    VALUES (${postId},${userId})`;

const deleteClap = (postId, userId) => `DELETE from claps 
     WHERE storyId=${postId} AND clappedBy=${userId}`;

const selectClaps = (postId, userId) => `SELECT * from claps 
    WHERE storyId=${postId} AND clappedBy=${userId}`;

const addTags = (tags, postId) => {
  const values = tags.map((tag) => `(${postId}, '${tag}')`);
  return `INSERT INTO tags VALUES ${values.join(',')}`;
};

const deletePost = (postId) => `DELETE from stories 
    WHERE id=${postId}`;

const getUser = (username) => `
    SELECT * from users where username='${username}'`;

const getClapsCount = (postId) => `
    SELECT count(*) as count from claps WHERE storyId=${postId}`;

const selectImages = () => 'select * from images order by imageId desc';
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
  getClapsCount
};
