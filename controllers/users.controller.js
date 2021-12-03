const { selectAllUsernames } = require("../models/users.model.js");

exports.getAllUsernames = (req, res, next) => {
  return selectAllUsernames()
    .then((usernames) => {
      res.status(200).send({ usernames });
    })
    .catch((err) => {
      next(err);
    });
};
