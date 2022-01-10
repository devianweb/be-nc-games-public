const express = require("express");
const app = express();
const apiRouter = require("./routers/api.router");
const cors = require("cors");
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
  pathErrors,
} = require("./errors");

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", pathErrors);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
