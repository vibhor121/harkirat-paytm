import bcrypt from "bcryptjs";
import { User } from "../../db";
import { signToken } from "../middleware/auth";

export async function signup(req: Request): Promise<Response> {
  const { firstName, lastName, email, password } = await req.json();

  const exists = await User.findOne({ email });
  if (exists) {
    return Response.json({ message: "User already exists" }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ firstName, lastName, email, password: hashedPassword });
  const token = signToken(String(user._id));

  return Response.json({ token }, { status: 201 });
}

export async function signin(req: Request): Promise<Response> {
  const { email, password } = await req.json();

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

export async function updateUser(req: Request): Promise<Response> {
  const { userId } = (req as any).user;
  const { firstName, lastName, password } = await req.json();

  const update: Record<string, string> = {};
  if (firstName) update.firstName = firstName;
  if (lastName) update.lastName = lastName;
  if (password) update.password = await bcrypt.hash(password, 10);

  await User.findByIdAndUpdate(userId, update);
  return Response.json({ message: "Updated successfully" });
}
