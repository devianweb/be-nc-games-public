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
