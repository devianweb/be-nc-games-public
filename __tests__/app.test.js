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
  test("400: bad 'inc_votes' value", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({ inc_votes: "meow" })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("invalid input");
      });
  });
  test("400: additional keys on patch body", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({ inc_votes: 1, name: "Mitch" })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("invalid input");
      });
  });
});
