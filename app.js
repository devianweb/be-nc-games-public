const express = require("express");
const app = express();
const apiRouter = require("./routers/api.router");
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
  pathErrors,
} = require("./errors");

app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", pathErrors);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
