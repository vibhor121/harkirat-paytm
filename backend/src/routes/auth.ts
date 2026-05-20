import bcrypt from "bcryptjs";
import { User } from "../../db";
import { signToken } from "../middleware/auth";
import { parseBody } from "../middleware/bodyParser";

export async function authRouter(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname.replace("/api/v1/auth", "");
  const method = req.method;

  if (path === "/signup" && method === "POST") return signup(req);
  if (path === "/signin" && method === "POST") return signin(req);

  return Response.json({ message: "Route not found" }, { status: 404 });
}

async function signup(req: Request): Promise<Response> {
  const { data, error } = await parseBody(req);
  if (error) return error;
  const { firstName, lastName, email, password } = data;

  const exists = await User.findOne({ email });
  if (exists) {
    return Response.json({ message: "User already exists" }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ firstName, lastName, email, password: hashedPassword });
  const token = signToken(String(user._id));

  return Response.json({ token }, { status: 201 });
}

async function signin(req: Request): Promise<Response> {
  const { data, error } = await parseBody(req);
  if (error) return error;
  const { email, password } = data;

  const user = await User.findOne({ email });
  if (!user) {
    return Response.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return Response.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const token = signToken(String(user._id));
  return Response.json({ token });
}
