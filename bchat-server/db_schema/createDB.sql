CREATE DATABASE communication_db;

USE communication_db;

CREATE TABLE channels (
  id INT AUTO_INCREMENT NOT NULL,
  channel_name VARCHAR(45) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE (channel_name)
);

CREATE TABLE users (
  id INT AUTO_INCREMENT NOT NULL,
  email VARCHAR(45) NOT NULL,
  pwd VARCHAR(255) NOT NULL,
  user_name VARCHAR(45) NOT NULL,
  avatar VARCHAR(255),
  PRIMARY KEY (id),
  UNIQUE (email)
);

CREATE TABLE messages (
  id INT AUTO_INCREMENT NOT NULL,
  channel_id INT NOT NULL,
  user_id INT NOT NULL,
  message VARCHAR(400) NOT NULL,
  time DATETIME NOT NULL,
  inactive TINYINT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  FOREIGN KEY (channel_id) REFERENCES channels(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO channels (channel_name)
VALUES ('Channel 1'), ('Channel 2'), ('Channel 3'), ('Channel 4'), ('Channel 5');
