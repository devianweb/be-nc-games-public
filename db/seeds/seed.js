const {
  dropTables,
  createCategories,
  createUsers,
  createReviews,
  createComments,
  seedCategories,
  seedUsers,
  seedReviews,
  seedComments,
} = require("./utils");

const seed = ({ categoryData, commentData, reviewData, userData }) => {
  return dropTables()
    .then(() => {
      return createCategories();
    })
    .then(() => {
      return createUsers();
    })
    .then(() => {
      return createReviews();
    })
    .then(() => {
      return createComments();
    })
    .then(() => {
      return seedCategories(categoryData);
    })
    .then(() => {
      return seedUsers(userData);
    })
    .then(() => {
      return seedReviews(reviewData);
    })
    .then(() => {
      return seedComments(commentData);
    });
};

module.exports = seed;
