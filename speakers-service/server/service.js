const express = require("express");
const path = require("path");
const Speakers = require("./lib/Speakers");
require("express-async-errors");

const service = express();

module.exports = (config) => {
  const log = config.log();

  const speakers = new Speakers(config.data.speakers);

  // Add a request logging middleware in development mode
  if (service.get("env") === "development") {
    service.use((req, res, next) => {
      log.debug(`${req.method}: ${req.url}`);
      return next();
    });
  }

  service.use(express.static(config.data.images));

  service.get("/list", async (req, res, next) => {
    return res.json(await speakers.getList());
  });

  service.get("/list-short", async (req, res, next) => {
    return res.json(await speakers.getListShort());
  });

  service.get("/names", async (req, res, next) => {
    return res.json(await speakers.getNames());
  });

  service.get("/artwork", async (req, res, next) => {
    return res.json(await speakers.getAllArtwork());
  });

  service.get("/speaker/:shortname", async (req, res, next) => {
    return res.json(await speakers.getSpeaker(req.params.shortname));
  });

  service.get("/artwork/:shortname", async (req, res, next) => {
    return res.json(await speakers.getArtworkForSpeaker(req.params.shortname));
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
