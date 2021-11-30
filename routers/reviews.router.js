const { getReviewsById } = require("../controllers/reviews.controller");
const { pathErrors } = require("../errors");
const reviewsRouter = require("express").Router();

reviewsRouter.route("/:review_id").get(getReviewsById);

reviewsRouter.all("/*", pathErrors);

module.exports = reviewsRouter;
