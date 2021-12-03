const { selectAllCategories } = require("../models/categories.model");

exports.getAllCategories = (req, res, next) => {
  return selectAllCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch((err) => {
      next(err);
    });
};
