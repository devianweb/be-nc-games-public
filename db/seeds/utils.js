const db = require("../connection");
const format = require("pg-format");

exports.dropTables = () => {
  return db
    .query("DROP TABLE IF EXISTS comments")
    .then(() => {
      return db.query("DROP TABLE IF EXISTS reviews");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS users");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS categories");
    });
};

exports.createCategories = () => {
  return db.query(`
  CREATE TABLE categories (
    slug VARCHAR(255) PRIMARY KEY NOT NULL,
    description VARCHAR(255) NOT NULL
  ) ;`);
};

exports.seedCategories = (data) => {
  const queryStr = format(
    `
    INSERT INTO categories
      (slug, description)
    VALUES
      %L
    RETURNING * ;
    `,
    data.map((category) => [category.slug, category.description])
  );
  return db.query(queryStr);
};

exports.createUsers = () => {
  return db.query(`
  CREATE TABLE users (
    username VARCHAR(255) PRIMARY KEY UNIQUE NOT NULL,
    avatar_url VARCHAR(255) NOT NULL,
    name VARCHAR (255) NOT NULL
  ) ;`);
};

exports.seedUsers = (data) => {
  const queryStr = format(
    `
    INSERT INTO users
      (username, avatar_url, name)
    VALUES
      %L
    RETURNING * ;
    `,
    data.map((user) => [user.username, user.avatar_url, user.name])
  );
  return db.query(queryStr);
};

exports.createReviews = () => {
  return db.query(`
  CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    review_body TEXT NOT NULL,
    designer VARCHAR (255) NOT NULL,
    review_img_url VARCHAR(255) NOT NULL DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
    votes INT NOT NULL DEFAULT 0,
    category VARCHAR(255) NOT NULL REFERENCES categories(slug) ON DELETE CASCADE,
    owner VARCHAR(255) REFERENCES users(username) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ;`);
};

exports.seedReviews = (data) => {
  const queryStr = format(
    `
    INSERT INTO reviews
      (title, review_body, designer, review_img_url, votes, category, owner, created_at)
    VALUES
      %L
    RETURNING * ;
    `,
    data.map((review) => [
      review.title,
      review.review_body,
      review.designer,
      review.review_img_url,
      review.votes,
      review.category,
      review.owner,
      review.created_at,
    ])
  );
  return db.query(queryStr);
};

exports.createComments = () => {
  return db.query(`
  CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    author VARCHAR(255) NOT NULL REFERENCES users(username),
    review_id INT NOT NULL REFERENCES reviews(review_id) ON DELETE CASCADE,
    votes INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    body TEXT NOT NULL
  ) ;`);
};

exports.seedComments = (data) => {
  const queryStr = format(
    `
    INSERT INTO comments
      (author, review_id, votes, created_at, body)
    VALUES
      %L
    RETURNING * ;
    `,
    data.map((comment) => [
      comment.author,
      comment.review_id,
      comment.votes,
      comment.created_at,
      comment.body,
    ])
  );
  return db.query(queryStr);
};
