const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const healthRoutes = require("./routes/health");
const exampleRoutes = require("./routes/example");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

function buildApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || "*",
      credentials: true,
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan(process.env.LOG_LEVEL || "dev"));

  app.use("/health", healthRoutes);
  app.use("/api/example", exampleRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = buildApp;
