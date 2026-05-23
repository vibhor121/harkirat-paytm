import bcrypt from "bcryptjs";
import { z } from "zod";
import { User, Account } from "../../db";
import { signToken } from "../middleware/auth";
import { parseBody } from "../middleware/bodyParser";

const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName:  z.string().min(1, "Last name is required"),
  email:     z.email("Invalid email"),
  password:  z.string().min(6, "Password must be at least 6 characters"),
});

const signinSchema = z.object({
  email:    z.email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

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

  const result = signupSchema.safeParse(data);
  if (!result.success) {
    return Response.json({ errors: result.error.issues }, { status: 400 });
  }

  const { firstName, lastName, email, password } = result.data;

  const exists = await User.findOne({ email });
  if (exists) {
    return Response.json({ message: "User already exists" }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ firstName, lastName, email, password: hashedPassword });

  const balance = Math.floor(Math.random() * 10000) + 1000;
  await Account.create({ userId: user._id, balance });

  const token = signToken(String(user._id));
  return Response.json({ message: "User created successfully", token }, { status: 201 });
}

async function signin(req: Request): Promise<Response> {
  const { data, error } = await parseBody(req);
  if (error) return error;

  const result = signinSchema.safeParse(data);
  if (!result.success) {
    return Response.json({ errors: result.error.issues }, { status: 400 });
  }

  const { email, password } = result.data;

  const user = await User.findOne({ email });
  if (!user) {
    return Response.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return Response.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const token = signToken(String(user._id));
  return Response.json({ message: "Login successful", token });
}
