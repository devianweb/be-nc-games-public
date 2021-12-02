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

exports.checkPatchBody = (body) => {
  if (
    Object.keys(body).length > 1 ||
    Object.keys(body)[0] !== "inc_votes" ||
    typeof body.inc_votes !== "number"
  ) {
    return Promise.reject({ status: 400, msg: "invalid input" });
  }
};

exports.checkCommentBody = (body) => {
  if (
    Object.keys(body).length > 2 ||
    !Object.keys(body).includes("username") ||
    !Object.keys(body).includes("body") ||
    typeof body.username !== "string" ||
    typeof body.body !== "string"
  ) {
    return Promise.reject({ status: 400, msg: "invalid input" });
  }
};
