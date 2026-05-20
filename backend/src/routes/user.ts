import bcrypt from "bcryptjs";
import { User } from "../../db";
import { authMiddleware } from "../middleware/auth";
import { parseBody } from "../middleware/bodyParser";

export async function userRouter(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname.replace("/api/v1/user", "");
  const method = req.method;

  if (path === "/update" && method === "PUT") {
    const auth = authMiddleware(req);
    if (auth instanceof Response) return auth;
    (req as any).user = auth;
    return updateUser(req);
  }

  return Response.json({ message: "Route not found" }, { status: 404 });
}

async function updateUser(req: Request): Promise<Response> {
  const { userId } = (req as any).user;
  const { data, error } = await parseBody(req);
  if (error) return error;
  const { firstName, lastName, password } = data;

  const update: Record<string, string> = {};
  if (firstName) update.firstName = firstName;
  if (lastName) update.lastName = lastName;
  if (password) update.password = await bcrypt.hash(password, 10);

  await User.findByIdAndUpdate(userId, update);
  return Response.json({ message: "Updated successfully" });
}
