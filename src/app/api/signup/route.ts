import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { email, password, username } = await req.json();

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
      username,
      email,
      passwordHash: hashedPassword,
    },
  });

  return NextResponse.json({ success: true });
}
