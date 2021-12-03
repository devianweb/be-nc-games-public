const { pathErrors } = require("../errors");
const apiRouter = require("express").Router();
const categoriesRouter = require("./categories.router");
const reviewsRouter = require("./reviews.router");
const commentsRouter = require("./comments.router");
const { getEndpoints } = require("../controllers/api.controller");

apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/reviews", reviewsRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.route("/").get(getEndpoints);

apiRouter.all("/*", pathErrors);

module.exports = apiRouter;
