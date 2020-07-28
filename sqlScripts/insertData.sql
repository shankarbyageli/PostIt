INSERT INTO users
  (username,avatar_url)
VALUES
  ('User1', 'https://avatars0.githubusercontent.com/u/58026823?v=4');

INSERT INTO stories
  (is_published, author_id, title, content, last_modified)
VALUES
  (0, 1, 'Sample Post', '{"type":"paragraph","blocks":[{"data":{"text":"First post"}}]}', 1552744582955);


INSERT INTO comments
  (comment_on,comment_by,commented_at,comment)
VALUES
  (1, 1, 1552744582955, 'superb!');