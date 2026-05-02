// server.js - FreshKeeper Express API entry point

const express = require("express");
const app = express();
const PORT = 3000;

// ── Middleware ─────────────────────────────────────────────
const logger = require("./middleware/logger");
app.use(express.json());
app.use(logger);

// ── Routes ─────────────────────────────────────────────────
const usersRouter = require("./routes/users");
const itemsRouter = require("./routes/items");
const recipesRouter = require("./routes/recipes");

app.use("/users", usersRouter);
app.use("/items", itemsRouter);
app.use("/recipes", recipesRouter);

// ── Health check ───────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    success: true,
    data: {
      message: "FreshKeeper API is running",
      version: "1.0.0",
      baseUrl: `http://localhost:${PORT}`
    },
    error: null
  });
});

// ── 404 handler ────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    data: null,
    error: {
      code: "NOT_FOUND",
      message: `Route ${req.method} ${req.originalUrl} not found.`,
      details: {}
    }
  });
});

// ── Global error handler ───────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unexpected error:", err);
  res.status(500).json({
    success: false,
    data: null,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred.",
      details: {}
    }
  });
});

// ── Start server ───────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`FreshKeeper API running on http://localhost:${PORT}`);
  console.log(`   Roles: admin | employee | consumer`);
  console.log(`   Set header: x-user-role: admin (or employee / consumer)`);
});
