#! /bin/bash

sqlite3 $1 << 'END_SQL'

DROP TABLE IF EXISTS users;
CREATE TABLE users (
  username VARCHAR(50) UNIQUE NOT NULL,
  avatar_url TEXT
);

DROP TABLE IF EXISTS stories;
CREATE TABLE stories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  author VARCHAR(50) UNIQUE NOT NULL,
  title TEXT,
  content TEXT,
  last_modified TIMESTAMP NOT NULL
);

DROP TABLE IF EXISTS published_stories;
CREATE TABLE published_stories (
  story_id INTEGER PRIMARY KEY,
  published_at TIMESTAMP NOT NULL,
  cover_image_id INTEGER 
);

DROP TABLE IF EXISTS images;
CREATE TABLE images (
  image_id INTEGER PRIMARY KEY AUTOINCREMENT,
  image_path TEXT
);

DROP TABLE IF EXISTS claps;
CREATE TABLE claps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  story_id INTEGER NOT NULL,
  clapped_by INTEGER NOT NULL
);

DROP TABLE IF EXISTS comments;
CREATE TABLE comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  comment_on INTEGER NOT NULL,
  comment_by INTEGER NOT NULL,
  commented_at TIMESTAMP NOT NULL,
  comment TEXT NOT NULL
);

DROP TABLE IF EXISTS followers;
CREATE TABLE followers (
  user_id VARCHAR(50) UNIQUE NOT NULL,
  follower_id VARCHAR(50) UNIQUE NOT NULL
);

DROP TABLE IF EXISTS tags;
CREATE TABLE tags (
  story_id INTEGER NOT NULL,
  tag TEXT NOT NULL
);

END_SQL