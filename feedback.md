# BE Northcoders NC Games Portfolio Check List

## Readme - Remove the one that was provided and write your own:

- [ ] Link to hosted version
- [ ] Write a summary of what the project is
- [ ] Provide clear instructions of how to clone, install dependencies, seed local database, and run tests
- [ ] Include information about how to create `.env.test` and `.env.development` files
- [ ] Specify minimum versions of `Node.js` and `Postgres` needed to run the project

## General

- [ ] Remove any unnecessary `console.logs` and comments
  > ONE LEFT 😭
- [ ] Remove all unnecessary files (e.g. old `README.md`, `error-handling.md`, `hosting.md`, `./db/utils/README.md` etc.)
- [ ] Functions and variables have descriptive names

## Creating tables

- [x] Use `NOT NULL` on required fields
- [x] Default `created_at` in reviews and comments tables to the current date:`TIMESTAMP DEFAULT NOW()`

## Inserting data

- [x] Drop tables and create tables in seed function in correct order
- [x] Make use of pg-format to insert data in the correct order

## Tests

- [x] Seeding before each test
- [x] Descriptive `it`/`test` block descriptions
- [x] If asserting inside a `forEach`, also has an assertion to check length is at least > 0
- [x] Evidence of building up complex query endpoints using TDD
- [x] Ensure all tests are passing
- [ ] Cover all endpoints and errors

- `GET /api/categories`

  - [x] Status 200, array of category objects

- `GET /api/reviews/:review_id`

  - [x] Status 200, single review object (including `comment_count`)
  - [x] Status 400, invalid ID, e.g. string of "not-an-id"
  - [x] Status 404, non existent ID, e.g. 0 or 9999

- `PATCH /api/reviews/:review_id`

  - [x] Status 200, updated single review object
  - [] Status 400, invalid ID, e.g. string of "not-an-id"
  - [x] Status 400, invalid inc_votes type, e.g. property is not a number
  - [x] Status 404, non existent ID, e.g. 0 or 9999
  - [ ] Status 200, missing `inc_votes` key. No effect to article.

- `GET /api/reviews`

  - [x] Status 200, array of review objects (including `comment_count`, excluding `body`)
  - [x] Status 200, default sort & order: `created_at`, `desc`
  - [x] Status 200, accepts `sort_by` query, e.g. `?sort_by=votes`
  - [x] Status 200, accepts `order` query, e.g. `?order=desc`
  - [x] Status 200, accepts `category` query, e.g. `?category=dexterity`
  - [x] Status 400. invalid `sort_by` query, e.g. `?sort_by=bananas`
  - [x] Status 400. invalid `order` query, e.g. `?order=bananas`
  - [x] Status 404. non-existent `category` query, e.g. `?category=bananas`
  - [x] Status 200. valid `category` query, but has no reviews responds with an empty array of reviews, e.g. `?category=children's games`

> You have tested sort_by, order and category queries but not on their own! I'll let you off this time...

- `GET /api/reviews/:review_id/comments`

  - [x] Status 200, array of comment objects for the specified review
  - [ ] Status 400, invalid ID, e.g. string of "not-an-id"
  - [x] Status 404, non existent ID, e.g. 0 or 9999
  - [ ] Status 200, valid ID, but has no comments responds with an empty array of comments

- `POST /api/reviews/:review_id/comments`

  - [ ] Status 201, created comment object
  - [ ] Status 400, invalid ID, e.g. string of "not-an-id"
  - [x] Status 404, non existent ID, e.g. 0 or 9999
  - [x] Status 400, missing required field(s), e.g. no username or body properties
  - [ ] Status 404, username does not exist
  - [ ] Status 201, ignores unnecessary properties

- `DELETE /api/comments/:comment_id`

  - [x] Status 204, deletes comment from database
  - [x] Status 404, non existent ID, e.g 999
  - [x] Status 400, invalid ID, e.g "not-an-id"

- `GET /api`

  - [x] Status 200, JSON describing all the available endpoints

## Routing

- [x] Split into api, categories, users, comments and reviews routers
- [x] Use `.route` for endpoints that share the same path

## Controllers

- [x] Name functions and variables well
- [x] Add catch blocks to all model invocations (and don't mix use of`.catch(next);` and `.catch(err => next(err))`)

## Models

- Protected from SQL injection
  - [x] Using parameterized queries for values in `db.query` e.g `$1` and array of variables
  - [x] Sanitizing any data for tables/columns, e.g. greenlisting when using template literals or pg-format's `%s`
- [x] Consistently use either single object argument _**or**_ multiple arguments in model functions
- [x] Use `LEFT JOIN` for comment counts

## Errors

- [x] Use error handling middleware functions in app and extracted to separate directory/file
- [x] Consistently use `Promise.reject` in either models _**OR**_ controllers

## Extra Tasks - To be completed after hosting

- `GET /api/users`

  - [ ] Status 200, responds with array of user objects

- `GET /api/users/:username`

  - [ ] Status 200, responds with single user object
  - [ ] Status 404, non existent ID, e.g 999
  - [ ] Status 400, invalid ID, e.g "not-an-id"

- `PATCH /api/comments/:comment_id`

  - [ ] Status 200, updated single comment object
  - [ ] Status 400, invalid ID, e.g. string of "not-an-id"
  - [ ] Status 400, invalid inc_votes type, e.g. property is not a number
  - [ ] Status 404, non existent ID, e.g. 0 or 9999
  - [ ] Status 200, missing `inc_votes` key. No effect to comment.

## Extra Advanced Tasks

### Easier

- [ ] Patch: Edit an review body
- [ ] Patch: Edit a comment body
- [ ] Patch: Edit a user's information
- [ ] Get: Search for an review by title
- [ ] Post: add a new user

### Harder

- [ ] Protect your endpoints with JWT authorization. We have notes on this that will help a bit, _but it will make building the front end of your site a little bit more difficult_
- [ ] Get: Add functionality to get reviews created in last 10 minutes
- [ ] Get: Get all reviews that have been liked by a user. This will require an additional junction table.
- [ ] Research and implement online image storage or random generation of images for categories

## FEEDBACK

### ESSENTIAL PATCH `/api/reviews/1`

> If the body is missing in the PATCH request (i.e. no votes_inc), the server should STILL send back the review with the comment count not updated and a response of 200 rather than 400: Bad request.

### ESSENTIAL GET `/api/reviews/1/comments`

> Slightly confusing... This should return a 200 when the article exists, whether or not there are any comments. It should simply return an empty array. No comments isn't an error!

### ESSENTIAL POST `/api/reviews/1/comments`

> You tested for an invalid username AND and invalid body in the same test! An incorrect username should return a 404: Not Found _OR_ 422: Unprocessable Entity status code when `POST` contains a valid username that does not exist.
