import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import apiRoutes from "./routes/api.routes.js";
import { openApiSpec } from "./swagger/swagger.js";
import { httpLoggingMiddleware } from "./utils/logger.js";

export const app = express();

app.use(cors());
app.use(express.json());
app.use(httpLoggingMiddleware);

// Swagger Documentation UI
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));

// Health Check
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "fiverr-growth-backend",
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use("/api/v1", apiRoutes);
