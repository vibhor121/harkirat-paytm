import { z } from "zod";
import mongoose from "mongoose";
import { Account } from "../../db";
import { authMiddleware } from "../middleware/auth";

const transferSchema = z.object({
  to: z.string().min(1),
  amount: z.number().positive(),
});

export async function accountRouter(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/api\/v1\/account/, "");
  const method = req.method;

  if (path === "/balance" && method === "GET") {
    const auth = authMiddleware(req);
    if (auth instanceof Response) return auth;
    return getBalance(auth.userId);
  }

  if (path === "/transfer" && method === "POST") {
    const auth = authMiddleware(req);
    if (auth instanceof Response) return auth;
    return transfer(req, auth.userId);
  }

  return Response.json({ message: "Route not found" }, { status: 404 });
}

async function getBalance(userId: string): Promise<Response> {
  try {
    const account = await Account.findOne({ userId });
    if (!account) return Response.json({ message: "Account not found" }, { status: 404 });
    return Response.json({ balance: account.balance });
  } catch {
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

async function transfer(req: Request, fromUserId: string): Promise<Response> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ message: "Invalid JSON" }, { status: 400 });
  }

  const result = transferSchema.safeParse(body);
  if (!result.success) {
    return Response.json({ errors: result.error.issues }, { status: 400 });
  }

  const { to: toUserId, amount } = result.data;

  if (fromUserId === toUserId) {
    return Response.json({ message: "Cannot transfer to yourself" }, { status: 400 });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const fromAccount = await Account.findOne({ userId: fromUserId }).session(session);
    if (!fromAccount) {
      await session.abortTransaction();
      return Response.json({ message: "Sender account not found" }, { status: 404 });
    }

    if (fromAccount.balance < amount) {
      await session.abortTransaction();
      return Response.json({ message: "Insufficient balance" }, { status: 400 });
    }

    const toAccount = await Account.findOne({ userId: toUserId }).session(session);
    if (!toAccount) {
      await session.abortTransaction();
      return Response.json({ message: "Recipient account not found" }, { status: 404 });
    }

    await Account.findByIdAndUpdate(
      fromAccount._id,
      { $inc: { balance: -amount } },
      { session }
    );

    await Account.findByIdAndUpdate(
      toAccount._id,
      { $inc: { balance: amount } },
      { session }
    );

    await session.commitTransaction();
    return Response.json({ message: "Transfer successful" });
  } catch {
    await session.abortTransaction();
    return Response.json({ message: "Transfer failed" }, { status: 500 });
  } finally {
    session.endSession();
  }
}
