import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config";

export function signToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): { userId: string } {
  return jwt.verify(token, JWT_SECRET) as { userId: string };
}

export function authMiddleware(req: Request): { userId: string } | Response {
  const header = req.headers.get("Authorization");
  if (!header?.startsWith("Bearer ")) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    return verifyToken(header.slice(7));
  } catch {
    return Response.json({ message: "Invalid token" }, { status: 401 });
  }
}
