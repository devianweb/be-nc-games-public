const { pathErrors } = require("../errors");
const usersRouter = require("express").Router();
const { getAllUsernames } = require("../controllers/users.controller");

usersRouter.route("/").get(getAllUsernames);

usersRouter.all("/*", pathErrors);

module.exports = usersRouter;
