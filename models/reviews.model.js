const db = require("../db/connection");
const { checkExists, checkPatchBody } = require("./utils");

exports.selectReviewsById = (id) => {
  return Promise.all([
    db.query(
      `
    SELECT reviews.*, COUNT(comments.review_id)::INT AS comment_count
    FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id
    WHERE reviews.review_id = $1
    GROUP BY reviews.review_id
    `,
      [id]
    ),
    checkExists("reviews", "review_id", id),
  ]).then((promise) => {
    return promise[0].rows[0];
  });
};

exports.updateReviewsById = (req_params, req_body) => {
  const { review_id } = req_params;
  const { inc_votes } = req_body;
  return Promise.all([
    checkPatchBody(req_body),
    checkExists("reviews", "review_id", review_id),
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
    return promise[2].rows[0];
  });
};

exports.selectAllReviews = ({
  sort_by = "created_at",
  order = "desc",
  category,
}) => {
  return db
    .query("SELECT slug FROM categories")
    .then((categories) => {
      const appCategories = [];
      for (const category of categories.rows) {
        if (!appCategories.includes(category.slug)) {
          appCategories.push(category.slug);
        }
      }
      const approvedColumns = [
        "review_id",
        "title",
        "review_body",
        "designer",
        "review_img_url",
        "votes",
        "category",
        "owner",
        "created_at",
        "comment_count",
      ];
      if (!approvedColumns.includes(sort_by)) {
        return Promise.reject({ status: 400, msg: "Invalid sort query" });
      }
      if (!["asc", "desc"].includes(order)) {
        return Promise.reject({ status: 400, msg: "Invalid order query" });
      }
      if (![undefined, ...appCategories].includes(category)) {
        return Promise.reject({ status: 400, msg: "Invalid category query" });
      }
    })
    .then(() => {
      let queryStr = `
    SELECT reviews.*, COUNT(comments.review_id)::INT AS comment_count
    FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id 
    `;

      if (category) queryStr += `WHERE reviews.category = '${category}' `;

      queryStr += `GROUP BY reviews.review_id ORDER BY ${sort_by} ${order} ;`;
      return db.query(queryStr);
    })
    .then(({ rows }) => {
      return rows;
    });
};

exports.selectCommentsByReviewId = (id) => {
  return Promise.all([
    db.query(
      `SELECT comment_id, author, votes, created_at, body FROM comments WHERE review_id = $1 ;`,
      [id]
    ),
    checkExists("reviews", "review_id", id),
  ]).then((promise) => {
    const { rows } = promise[0];
    return rows;
  });
};
