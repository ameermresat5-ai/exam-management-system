const app = require("./app");
const env = require("./config/env");

const server = app.listen(env.port, () => {
  console.log(`Server running on port ${env.port}`);
});

const shutdown = (signal) => {
  console.log(`${signal} received. Closing server.`);
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
