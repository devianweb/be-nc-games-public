const {
  getReviewsById,
  patchReviewsById,
  getAllReviews,
} = require("../controllers/reviews.controller");
const { pathErrors } = require("../errors");
const reviewsRouter = require("express").Router();

reviewsRouter.route("/").get(getAllReviews);
reviewsRouter.route("/:review_id").get(getReviewsById).patch(patchReviewsById);

reviewsRouter.all("/*", pathErrors);

module.exports = reviewsRouter;
