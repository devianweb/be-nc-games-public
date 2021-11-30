const { selectReviewsById } = require("../models/reviews.model");

exports.getReviewsById = (req, res, next) => {
  const { review_id } = req.params;
  return selectReviewsById(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};
