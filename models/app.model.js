exports.selectEndpoints = () => {
  const availableEndpoints = {
    "GET all categories": "GET /api/categories",
    "GET review by review_id": "GET /api/reviews/:review_id",
    "PATCH review by review_id": "PATCH /api/reviews/:review_id",
    "GET all reviews": "GET /api/reviews",
    "GET comments by review_id": "GET /api/reviews/:review_id/comments",
    "POST comment by review_id": "POST /api/reviews/:review_id/comments",
    "DELETE comments by commend_id": "DELETE /api/comments/:comment_id",
    "GET all available endpoints": "GET /api",
    "GET all users": "GET /api/users",
  };
  return availableEndpoints;
};
