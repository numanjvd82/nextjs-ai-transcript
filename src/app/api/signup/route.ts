import { NextResponse } from "next/server";
import { hashPassword } from "@/app/lib/auth";
import { PrismaClient } from "@prisma/client";

export async function POST(req: Request) {
  const { email, password, username } = await req.json();
  const prisma = new PrismaClient();

  const hashedPassword = await hashPassword(password);
  await prisma.user.create({
    data: {
      email,
      passwordHash: hashedPassword,
      username,
    },
  });

  return NextResponse.json({ success: true });
}
