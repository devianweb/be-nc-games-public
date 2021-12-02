const {
  selectReviewsById,
  updateReviewsById,
  selectAllReviews,
  selectCommentsByReviewId,
} = require("../models/reviews.model");

exports.getReviewsById = (req, res, next) => {
  const { review_id } = req.params;
  return selectReviewsById(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchReviewsById = (req, res, next) => {
  return updateReviewsById(req.params, req.body)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllReviews = (req, res, next) => {
  return selectAllReviews(req.query)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  return selectCommentsByReviewId(review_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};
