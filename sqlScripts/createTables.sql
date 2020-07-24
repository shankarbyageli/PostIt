CREATE TABLE IF NOT EXISTS users (
  user_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  avatar_url TEXT
);

CREATE TABLE IF NOT EXISTS stories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  author_id INTEGER,
  title TEXT,
  content TEXT,
  last_modified TIMESTAMP NOT NULL,
  FOREIGN KEY(author_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS published_stories (
  story_id INTEGER,
  published_at TIMESTAMP NOT NULL,
  cover_image_id INTEGER ,
  FOREIGN KEY(story_id) REFERENCES stories(id),
  FOREIGN KEY(cover_image_id) REFERENCES images(image_id)
);

CREATE TABLE IF NOT EXISTS images (
  image_id INTEGER PRIMARY KEY AUTOINCREMENT,
  image_path TEXT
);

CREATE TABLE IF NOT EXISTS claps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  story_id INTEGER,
  clapped_by INTEGER ,
  FOREIGN KEY(story_id) REFERENCES stories(id),
  FOREIGN KEY(clapped_by) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  comment_on INTEGER,
  comment_by INTEGER,
  commented_at TIMESTAMP NOT NULL,
  comment TEXT NOT NULL,
  FOREIGN KEY(comment_on) REFERENCES stories(id),
  FOREIGN KEY(comment_by) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS followers (
  user_id INTEGER,
  follower_id INTEGER,
  FOREIGN KEY(user_id) REFERENCES users(user_id),
  FOREIGN KEY(follower_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS tags (
  story_id INTEGER INTEGER,
  tag TEXT NOT NULL,
  FOREIGN KEY(story_id) REFERENCES stories(id)
);

