import express from "express";

import cors from "cors";

import helmet from "helmet";

import morgan from "morgan";

import apiRoutes from "./routes";

import authRoutes from "./routes/auth.routes";

import aiRoutes from "./routes/ai.routes";
import documentRoutes from "./routes/document.routes";
import userRoutes from "./routes/user.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import templateRoutes from "./routes/template.routes";
import reviewRoutes from "./routes/review.routes";

import { env } from "./config/env";

import { errorHandler } from "./middleware/error.middleware";



const app = express();



// ─── Security & Logging ───────────────────────────────────────────────────────

app.use(helmet());

const allowedOrigins = [
  "http://localhost:3000",
  "https://writeflow-ai-five.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));



// ─── Body Parsing ─────────────────────────────────────────────────────────────

app.use(express.json({ limit: "500kb" }));

app.use(express.urlencoded({ extended: true }));



// ─── Routes ───────────────────────────────────────────────────────────────────

app.use("/api/v1", apiRoutes);

console.log("Backend route registration: /api/auth -> authRoutes");
app.use("/api/auth", authRoutes);

app.use("/api/ai", aiRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/items", templateRoutes);
app.use("/api/reviews", reviewRoutes);



// ─── Health Check ─────────────────────────────────────────────────────────────

app.get("/health", (_req, res) => {

  res.json({ status: "ok", timestamp: new Date().toISOString() });

});



// ─── Global Error Handler (must be last) ─────────────────────────────────────

app.use(errorHandler);



export default app;

