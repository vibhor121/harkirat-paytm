import { connectDB } from "./src/db";
import { apiRouter } from "./src/routes/index";
import { withCors } from "./src/middleware/cors";

await connectDB();

Bun.serve({
  port: process.env.PORT ? Number(process.env.PORT) : 3000,
  routes: {
    "/api/v1/*": withCors(apiRouter),
  },
  development: { hmr: true, console: true },
});

console.log("Paytm backend running on http://localhost:3000");
