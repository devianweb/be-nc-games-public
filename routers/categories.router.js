const { pathErrors } = require("../errors");
const categoriesRouter = require("express").Router();
const { getAllCategories } = require("../controllers/categories.controller");

categoriesRouter.route("/").get(getAllCategories);

categoriesRouter.all("/*", pathErrors);

module.exports = categoriesRouter;
