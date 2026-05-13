require("dotenv").config();

const buildApp = require("./app");

const PORT = Number(process.env.PORT) || 3000;
const app = buildApp();

const server = app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});

function shutdown(signal) {
  console.log(`\n${signal} received. Closing server...`);
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
