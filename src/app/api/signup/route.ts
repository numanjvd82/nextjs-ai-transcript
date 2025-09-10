import { NextResponse } from "next/server";
import { hashPassword } from "@/app/lib/auth";
import { PrismaClient } from "@prisma/client";

export async function POST(req: Request) {
  const { email, password, username } = await req.json();
  const prisma = new PrismaClient();

  const checkUsername = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (checkUsername) {
    return NextResponse.json(
      { error: "Username already exists" },
      {
        status: 409,
      }
    );
  }

  const checkEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (checkEmail) {
    return NextResponse.json(
      { error: "Email already exists" },
      {
        status: 409,
      }
    );
  }

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
