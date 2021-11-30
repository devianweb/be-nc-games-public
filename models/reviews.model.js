const db = require("../db/connection");
const { countRows, checkExists } = require("./utils");

exports.selectReviewsById = (id) => {
  return Promise.all([
    db.query("SELECT * FROM reviews WHERE review_id = $1", [id]),
    countRows("comments", "review_id", id),
    checkExists("reviews", "review_id", id),
  ]).then((promise) => {
    return { ...promise[0].rows[0], comment_count: Number(promise[1].count) };
  });
};
