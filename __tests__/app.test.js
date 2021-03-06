const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("ALL <invalid path>", () => {
  test("404: /apples returns message 'path not found'", () => {
    return request(app)
      .get("/apples")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toEqual("path not found");
      });
  });
  test("404: '/api/apples' returns message 'path not found'", () => {
    return request(app)
      .get("/api/apples")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toEqual("path not found");
      });
  });
});

describe("GET /api/categories", () => {
  test("200: response should have key 'categories' containing an array of objects", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty("categories", expect.any(Array));
      });
  });
  test("200: response array should have length 4", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((response) => {
        expect(response.body.categories.length).toBe(4);
      });
  });
  test("200: each array element should have keys 'slug' and 'description'", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((response) => {
        expect(response.body.categories.length > 0).toBe(true);
        response.body.categories.forEach((category) => {
          expect(category).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/reviews/:review_id", () => {
  test("200: returns an object with the correct review_id", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then(({ body: { review } }) => {
        expect(review).toHaveProperty("review_id", 1);
      });
  });
  test("200: object has keys owner, title, review_id, review_body, designer, review_img_url, category, created_at, votes and comment_count", () => {
    return request(app)
      .get("/api/reviews/3")
      .expect(200)
      .then(({ body: { review } }) => {
        expect(review).toEqual(
          expect.objectContaining({
            owner: expect.any(String),
            title: expect.any(String),
            review_id: expect.any(Number),
            review_body: expect.any(String),
            designer: expect.any(String),
            review_img_url: expect.any(String),
            category: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          })
        );
      });
  });
  test("200: comment_count is correct", () => {
    return request(app)
      .get("/api/reviews/3")
      .expect(200)
      .then(({ body: { review } }) => {
        expect(review).toHaveProperty("comment_count", 3);
      });
  });
  test("400: bad review_id", () => {
    return request(app)
      .get("/api/reviews/bob")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("invalid input");
      });
  });
  test("404: good review_id but does not exist", () => {
    return request(app)
      .get("/api/reviews/999")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("does not exist");
      });
  });
});

describe("PATCH /api/reviews/:review_id", () => {
  test("200: returns object", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body: { review } }) => {
        expect(typeof review).toBe("object");
      });
  });
  test("200: returned object has updated votes value", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body: { review } }) => {
        expect(review).toHaveProperty("votes", 2);
      });
  });
  test("200: returned object has correct structure", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body: { review } }) => {
        expect(review).toEqual(
          expect.objectContaining({
            owner: expect.any(String),
            title: expect.any(String),
            review_id: expect.any(Number),
            review_body: expect.any(String),
            designer: expect.any(String),
            review_img_url: expect.any(String),
            category: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          })
        );
      });
  });
  test("200: returned object does not have 'inc_votes' property", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body: { review } }) => {
        expect(review).not.toHaveProperty("inc_votes");
      });
  });
  test("200: missing 'inc_votes' key", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({})
      .expect(200)
      .then(({ body: { review } }) => {
        expect(typeof review).toBe("object");
      });
  });
  test("400: bad 'inc_votes' value", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({ inc_votes: "meow" })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("invalid input");
      });
  });
  test("404: bad 'review_id'", () => {
    return request(app)
      .patch("/api/reviews/99")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("does not exist");
      });
  });
  test("400: bad 'review_id' value", () => {
    return request(app)
      .patch("/api/reviews/not-an-id")
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("invalid input");
      });
  });
});

describe("GET /api/reviews", () => {
  test("200: returns an object containing an array of reviews", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews.length === 13).toBe(true);
        expect(body).toEqual(
          expect.objectContaining({
            reviews: expect.any(Array),
          })
        );
      });
  });
  test("200: each object has correct keys", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews.length > 0).toBe(true);
        reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              owner: expect.any(String),
              title: expect.any(String),
              review_id: expect.any(Number),
              review_body: expect.any(String),
              designer: expect.any(String),
              review_img_url: expect.any(String),
              category: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  test("200: returns sorted object in correct order when given no queries", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews.length > 0).toBe(true);
        expect(reviews).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("200: returns sorted object in correct order when given sort_by and order queries", () => {
    return request(app)
      .get("/api/reviews?sort_by=review_id&order=asc")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews.length > 0).toBe(true);
        expect(reviews).toBeSortedBy("review_id", {
          descending: false,
        });
      });
  });
  test("200: returns sorted object in correct order when given sort_by, order and category queries", () => {
    return request(app)
      .get("/api/reviews?sort_by=review_id&order=asc&category=dexterity")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews.length > 0).toBe(true);
        expect(reviews).toBeSortedBy("review_id", {
          descending: false,
        });
        reviews.forEach((review) => {
          expect(review).toHaveProperty("category", "dexterity");
        });
      });
  });
  test("400: invalid sort_by query", () => {
    return request(app)
      .get("/api/reviews?sort_by=dogs")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid sort query");
      });
  });
  test("400: invalid order query", () => {
    return request(app)
      .get("/api/reviews?order=backwards")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid order query");
      });
  });
  test("400: invalid category query", () => {
    return request(app)
      .get("/api/reviews?category=cats")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("invalid category query");
      });
  });
  test("404: category exists but no associated reviews", () => {
    return request(app)
      .get("/api/reviews?category=children's games")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(
          expect.objectContaining({
            reviews: expect.any(Array),
          })
        );
      });
  });
});

describe("GET /api/reviews/:review_id/comments", () => {
  test("200: returns an array of objects with the correct properties", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(
          expect.objectContaining({
            comments: expect.any(Array),
          })
        );
        const { comments } = body;
        expect(comments.length).toBe(3);
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            })
          );
          expect(comment).not.toHaveProperty("review_id");
        });
      });
  });
  test("200: no comments associated with that id", () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(0);
      });
  });
  test("404: invalid id", () => {
    return request(app)
      .get("/api/reviews/not-an-id/comments")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("invalid input");
      });
  });
  test("404: id does not exist", () => {
    return request(app)
      .get("/api/reviews/99/comments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("does not exist");
      });
  });
});

describe("POST /api/reviews/:review_id/comments", () => {
  test("201: comment object is returned and has been added to comments table", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({
        username: "dav3rid",
        body: "This game is awesome!",
      })
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: 7,
            author: "dav3rid",
            review_id: 1,
            votes: 0,
            created_at: expect.any(String),
            body: "This game is awesome!",
          })
        );
      })
      .then(() => {
        return db.query(`SELECT * FROM comments`).then(({ rows }) => {
          expect(rows.length).toBe(7);
        });
      });
  });
  test("201: ignores additional properties", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({
        username: "dav3rid",
        body: "This game is awesome!",
        thing: "I'm an additional property!",
      })
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: 7,
            author: "dav3rid",
            review_id: 1,
            votes: 0,
            created_at: expect.any(String),
            body: "This game is awesome!",
          })
        );
        expect(comment).not.toHaveProperty("thing");
      })
      .then(() => {
        return db.query(`SELECT * FROM comments`).then(({ rows }) => {
          expect(rows.length).toBe(7);
        });
      });
  });
  test("400: body is missing keys", () => {
    return Promise.all([
      request(app)
        .post("/api/reviews/1/comments")
        .send({
          username: "dav3rid",
          junk: "this shouldn't be here!",
        })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("invalid input");
        }),
      request(app)
        .post("/api/reviews/1/comments")
        .send({
          body: "valid input",
          junk: "this shouldn't be here!",
        })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("invalid input");
        }),
    ]);
  });
  test("404: review_id doesn't exist", () => {
    return request(app)
      .post("/api/reviews/99/comments")
      .send({
        username: "dav3rid",
        body: "This game is awesome!",
      })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("does not exist");
      });
  });
  test("400: invalid review_id", () => {
    return request(app)
      .post("/api/reviews/not-an-id/comments")
      .send({
        username: "dav3rid",
        body: "This game is awesome!",
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("invalid input");
      });
  });
  test("400: username does not exist", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({
        username: "carricg",
        body: "This is my league username!",
      })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("does not exist");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: deletes comment and returns no content", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(() => {
        return db.query("SELECT * FROM comments");
      })
      .then(({ rows }) => {
        expect(rows.length).toBe(5);
      });
  });
  test("204: correct comment is deleted", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(() => {
        return db.query("SELECT * FROM comments");
      })
      .then(({ rows }) => {
        expect(rows.length > 0).toBe(true);
        rows.forEach((comment) => {
          expect(comment).not.toHaveProperty("comment_id", 1);
        });
      });
  });
  test("404: valid comment_id but does not exist", () => {
    return request(app)
      .delete("/api/comments/99")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("does not exist");
      });
  });
  test("400: invalid comment_id value", () => {
    return request(app)
      .delete("/api/comments/kittens")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("invalid input");
      });
  });
});

describe("GET /api", () => {
  test("200: returns object containing available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(
          expect.objectContaining({
            endpoints: expect.any(Object),
          })
        );
      });
  });
});

describe("GET /api/users", () => {
  test("200: responds with array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { usernames } }) => {
        expect(usernames.length > 0).toBe(true);
        usernames.forEach((username) => {
          expect(username).toEqual(
            expect.objectContaining({
              username: expect.any(String),
            })
          );
        });
      });
  });
});
