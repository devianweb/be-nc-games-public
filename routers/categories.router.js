const categoriesRouter = require("express").Router();

const {
  getAllCategories,
} = require("../controllers/categories/categories.controller");

categoriesRouter.route("/").get(getAllCategories);

module.exports = categoriesRouter;
