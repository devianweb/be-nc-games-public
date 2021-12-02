const {
  getReviewsById,
  patchReviewsById,
  getAllReviews,
  getCommentsByReviewId,
} = require("../controllers/reviews.controller");
const { pathErrors } = require("../errors");
const reviewsRouter = require("express").Router();

reviewsRouter.route("/").get(getAllReviews);
reviewsRouter.route("/:review_id").get(getReviewsById).patch(patchReviewsById);
reviewsRouter.route("/:review_id/comments").get(getCommentsByReviewId);

reviewsRouter.all("/*", pathErrors);

module.exports = reviewsRouter;
