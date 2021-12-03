const db = require("../db/connection");
const { checkExists } = require("./utils");

exports.removeCommentById = (id) => {
  return Promise.all([
    checkExists("comments", "comment_id", id),
    db.query(`DELETE FROM comments WHERE comment_id = $1`, [id]),
  ]);
};
