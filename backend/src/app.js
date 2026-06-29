const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const client = require("prom-client");

const env = require("./config/env");
const apiRoutes = require("./routes");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const register = new client.Registry();

client.collectDefaultMetrics({ register });

const httpRequestCounter = new client.Counter({
  name: "exam_http_requests_total",
  help: "Total number of HTTP requests processed by the exam backend.",
  labelNames: ["method", "route", "status_code"],
  registers: [register],
});

const getRouteLabel = (req) => {
  if (req.route && req.route.path) {
    const routePath = Array.isArray(req.route.path)
      ? req.route.path.join(",")
      : req.route.path;

    return `${req.baseUrl || ""}${routePath}`;
  }

  return req.path || (req.originalUrl || "unknown").split("?")[0];
};

const apiLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

app.use(helmet());
app.use(cors({ origin: env.corsOrigin }));
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.on("finish", () => {
    httpRequestCounter.inc({
      method: req.method,
      route: getRouteLabel(req),
      status_code: String(res.statusCode),
    });
  });

  next();
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

app.get("/ready", (req, res) => {
  res.status(200).json({
    success: true,
    status: "ready",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", apiLimiter, apiRoutes);

app.get("/metrics", async (req, res, next) => {
  try {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    next(error);
  }
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
