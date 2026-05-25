import "dotenv/config";
import app from "./app";
import connectDB from "./config/db";
import { env } from "./config/env";

async function bootstrap(): Promise<void> {
  await connectDB();

  const server = app.listen(env.PORT, () => {
    console.log(
      `[server] Running in ${env.NODE_ENV} mode on http://localhost:${env.PORT}`
    );
  });

  // Graceful shutdown
  const shutdown = (signal: string) => {
    console.log(`[server] ${signal} received — shutting down gracefully.`);
    server.close(() => {
      console.log("[server] HTTP server closed.");
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

bootstrap().catch((err) => {
  console.error("[server] Fatal startup error:", err);
  process.exit(1);
});
