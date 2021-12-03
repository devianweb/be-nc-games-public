const { selectEndpoints } = require("../models/app.model");

exports.getEndpoints = (req, res, next) => {
  const endpoints = selectEndpoints();
  res.status(200).send({ endpoints });
};
