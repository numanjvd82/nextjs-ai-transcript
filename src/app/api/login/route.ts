import { NextResponse } from "next/server";
import { verifyPassword, signJwt } from "@/app/lib/auth";
import { PrismaClient } from "@prisma/client";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const prisma = new PrismaClient();
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = signJwt({ id: user.id, email });

  const res = NextResponse.json({ success: true });
  res.cookies.set("token", token, { httpOnly: true, secure: true });
  return res;
}
