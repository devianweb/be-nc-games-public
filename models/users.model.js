const db = require("../db/connection");

exports.selectAllUsernames = () => {
  return db.query(`SELECT username FROM users`).then(({ rows }) => {
    return rows;
  });
};
