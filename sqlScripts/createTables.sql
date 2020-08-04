CREATE TABLE IF NOT EXISTS users (
  userId INTEGER PRIMARY KEY AUTOINCREMENT,
  username VARCHAR(50) UNIQUE,
  avatarUrl TEXT
);

CREATE TABLE IF NOT EXISTS stories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  isPublished INTEGER DEFAULT 0,
  authorId INTEGER,
  title TEXT,
  content TEXT,
  coverImageId INTEGER ,
  lastModified TIMESTAMP NOT NULL,
  FOREIGN KEY(authorId) REFERENCES users(userId),
  FOREIGN KEY(coverImageId) REFERENCES images(imageId)
);

CREATE TABLE IF NOT EXISTS images (
  imageId INTEGER PRIMARY KEY AUTOINCREMENT,
  imagePath TEXT
);

CREATE TABLE IF NOT EXISTS claps (
  storyId INTEGER NOT NULL,
  clappedBy INTEGER NOT NULL,
  PRIMARY KEY(storyId, clappedBy),
  FOREIGN KEY(storyId) REFERENCES stories(id),
  FOREIGN KEY(clappedBy) REFERENCES users(userId)
);

CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  commentOn INTEGER,
  commentBy INTEGER,
  commentedAt TIMESTAMP NOT NULL,
  comment TEXT NOT NULL,
  FOREIGN KEY(commentOn) REFERENCES stories(id),
  FOREIGN KEY(commentBy) REFERENCES users(userId)
);

CREATE TABLE IF NOT EXISTS followers (
  userId INTEGER,
  followerId INTEGER,
  PRIMARY KEY (userId, followerId),
  FOREIGN KEY(userId) REFERENCES users(userId),
  FOREIGN KEY(followerId) REFERENCES users(userId)
);

CREATE TABLE IF NOT EXISTS tags (
  storyId INTEGER INTEGER,
  tag TEXT NOT NULL,
  FOREIGN KEY(storyId) REFERENCES stories(id)
);

