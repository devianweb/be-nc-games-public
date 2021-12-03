const db = require("../db/connection");
const format = require("pg-format");

exports.checkExists = (table, column, value) => {
  const sql = format("SELECT * FROM %I WHERE %I = %L", table, column, value);
  return db.query(sql).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "does not exist" });
    }
  });
};

exports.checkCommentBody = (body) => {
  if (
    !Object.keys(body).includes("username") ||
    !Object.keys(body).includes("body")
  ) {
    return Promise.reject({ status: 400, msg: "invalid input" });
  }
};
