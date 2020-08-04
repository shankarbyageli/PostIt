INSERT INTO users
  (username,avatarUrl,displayName)
VALUES
  ('User1', 'https://avatars0.githubusercontent.com/u/58026823?v=4','User1'),
  ('User2', 'https://avatars0.githubusercontent.com/u/58026823?v=4','User2');

INSERT INTO stories
  (isPublished, authorId, title, content, lastModified, coverImageId)
VALUES
  (0, 1, 'Sample Post', '{"type":"paragraph","blocks":[{"data":{"text":"First post"}}]}', 1552744582955, null),
  (0, 1, 'publish this', '{"type":"paragraph","blocks":[{"data":{"text":"First post"}}]}', 1552744582960, null),
  (1, 1, 'Read this blog', '{"type":"paragraph","blocks":[{"data":{"text":"First post"}}]}', 1552744583960,1),
  (1, 1, 'Comment on this', '{"type":"paragraph","blocks":[{"data":{"text":"First post"}}]}', 1552744583960,2),
  (1, 2, 'testing search', '{"type":"paragraph","blocks":[{"data":{"text":"First post"}}]}', 1552744583960,3),
  (1, 2, 'testing the search', '{"type":"paragraph","blocks":[{"data":{"text":"First post"}}]}', 1552744583960,1);

INSERT INTO comments
  (commentOn,commentBy,commentedAt,comment)
VALUES
  (4, 1, 1552744582955, 'superb!');

INSERT INTO tags
  (storyId,tag)
VALUES
  (5,'testing');

INSERT INTO images (imagePath) VALUES ('myfile');
INSERT INTO images (imagePath) VALUES ('myfile1');
INSERT INTO images (imagePath) VALUES ('myfile2');

INSERT INTO claps VALUES (4,1);

INSERT INTO followers VALUES (2,1);