import { authRouter } from "./auth";
import { userRouter } from "./user";

export async function apiRouter(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname.replace("/api/v1", "");

  if (path.startsWith("/auth")) return authRouter(req);
  if (path.startsWith("/user")) return userRouter(req);

  return Response.json({ message: "Route not found" }, { status: 404 });
}
