require("express-async-errors");
const express = require("express");
const service = express();

const bodyParser = require("body-parser");

const Feedback = require("./lib/Feedback");

module.exports = (config) => {
  const log = config.log();

  const feedback = new Feedback(config.data.feedback);

  service.use(bodyParser.json());
  service.use(bodyParser.urlencoded({ extended: true }));

  // Add a request logging middleware in development mode
  if (service.get("env") === "development") {
    service.use((req, res, next) => {
      log.debug(`${req.method}: ${req.url}`);
      return next();
    });
  }

  service.get("/list", async (req, res) => res.json(await feedback.getList()));

  service.post("/add-entry", async (req, res) => {
    const { name, title, message } = req.body;
    await feedback.addEntry(name, title, message);
    return res.sendStatus(200);
  });

  // eslint-disable-next-line no-unused-vars
  service.use((error, req, res, next) => {
    res.status(error.status || 500);
    // Log out the error to the console
    log.error(error);
    return res.json({
      error: {
        message: error.message,
      },
    });
  });
  return service;
};
