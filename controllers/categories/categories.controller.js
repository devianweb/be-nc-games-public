const {
  selectAllCategories,
} = require("../../models/categories/categories.model");

exports.getAllCategories = (req, res, next) => {
  return selectAllCategories().then((categories) => {
    res.status(200).send({ categories });
  });
};
