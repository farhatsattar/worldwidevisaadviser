require("dotenv").config();

const requiredEnv = ["JWT_SECRET"];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

// Loads Firebase Admin + Firestore (validates service account env)
require("./src/config/firebase");

const authRoutes = require("./src/routes/authRoutes");
const referralRoutes = require("./src/routes/referralRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");
const { notFound, errorHandler } = require("./src/middleware/errorMiddleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/referrals", referralRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log(`Visa Consultancy API listening on port ${PORT}`);
});
