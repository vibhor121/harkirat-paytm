import { connectDB } from "./src/db";
import { apiRouter } from "./src/routes/index";

await connectDB();

Bun.serve({
  port: process.env.PORT ? Number(process.env.PORT) : 3000,
  routes: {
    "/api/v1/*": apiRouter,
  },
  development: { hmr: true, console: true },
});

console.log("Paytm backend running on http://localhost:3000");
