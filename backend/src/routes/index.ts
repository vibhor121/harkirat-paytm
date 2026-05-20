import { signup, signin, updateUser } from "./auth";
import { authMiddleware } from "../middleware/auth";

export async function apiRouter(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname.replace("/api/v1", "");
  const method = req.method;

  if (path === "/auth/signup" && method === "POST") return signup(req);
  if (path === "/auth/signin" && method === "POST") return signin(req);

  if (path === "/user/update" && method === "PUT") {
    const auth = authMiddleware(req);
    if (auth instanceof Response) return auth;
    (req as any).user = auth;
    return updateUser(req);
  }

  return Response.json({ message: "Route not found" }, { status: 404 });
}
