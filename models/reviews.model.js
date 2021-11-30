const db = require("../db/connection");
const { countRows, checkExists, checkPatchBody } = require("./utils");

exports.selectReviewsById = (id) => {
  return Promise.all([
    db.query("SELECT * FROM reviews WHERE review_id = $1", [id]),
    countRows("comments", "review_id", id),
    checkExists("reviews", "review_id", id),
  ]).then((promise) => {
    return { ...promise[0].rows[0], comment_count: Number(promise[1].count) };
  });
};

exports.updateReviewsById = (req_params, req_body) => {
  const { review_id } = req_params;
  const { inc_votes } = req_body;
  return Promise.all([
    checkPatchBody(req_body),
    db.query(
      `
  UPDATE reviews
  SET votes = votes + $1
  WHERE review_id = $2
  RETURNING *
  `,
      [inc_votes, review_id]
    ),
  ]).then((promise) => {
    return promise[1].rows[0];
  });
};
