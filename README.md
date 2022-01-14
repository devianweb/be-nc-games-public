# HOUSE OF GAMES BACK END API

## Background

Hey! This is my first server backend that i've built from scratch. At the moment it contains reviews, categories for those reviews and a number of comments for each review.

Technology and package wise, the server is setup using `express.js`, and is making requests to an SQL server using `postgreSQL`. It has been hosted on `heroku`, and is setup to push to the `heroku` platform when the code is pushed up to `github`, and it has gone through the workflow having passed its testing phase. Testing is being handled using a couple of packages, mainly `jest` and `supertest`

## Hosting

https://ian-nc-games.herokuapp.com/api

## Cloning

To clone the repo, go to the github repo (`https://github.com/devianweb/be-nc-games-public`), select the 'code' dropdown menu and then clone the repo down to your local files. This can be done using `git clone <repo-url-here>`.

## Creating .env files

To run this program correctly, you will need to create the following files in your _root_ directory.

- `.env.test`
  - and then input the following line `PGDATABASE=nc_games_test`
- `.env.development`
  - and then input the following line `PGDATABASE=nc_games`

This will point the program at the correct database.

## Installing dependencies

The package.json file should have been pulled down from github when you cloned it. As such, if you use the command `npm install` it should install all dependencies for you.

## Seeding the local databases

The following commands have been setup for you and will create and seed the databases:

- `npm run setup-dbs`
- `npm run seed`

If these commands run with no issues, the db's should be setup and seeded.

## Running the tests

The following command will allow you to run the `jest` tests:

- `npm test`

This will run all the tests in the program.

## Minimum versions

This back end was developed on the following versions:

node.js

- v16.9.1

postgres

- PostgreSQL 12.9 (Ubuntu 12.9-0ubuntu0.20.04.1) on x86_64-pc-linux-gnu, compiled by gcc (Ubuntu 9.3.0-17ubuntu1~20.04) 9.3.0, 64-bit
