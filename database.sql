-- First command
CREATE DATABASE todo_database;

-- \c into todo_database

-- Second command
CREATE TABLE todo(
  todo_id SERIAL PRIMARY KEY,
  description VARCHAR(255)
);
