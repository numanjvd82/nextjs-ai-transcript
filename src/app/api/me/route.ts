import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyJwt } from "@/app/lib/auth";

export async function GET(req: Request) {
  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) {
    return NextResponse.json({ user: null });
  }

  const cookies = Object.fromEntries(
    cookieHeader.split("; ").map((c) => {
      const [key, ...v] = c.split("=");
      return [key, v.join("=")];
    })
  );

  const token = cookies.token;
  if (!token) {
    return NextResponse.json({ user: null });
  }

  try {
    const payload = verifyJwt(token) as {
      id: number;
      email: string;
    };
    if (!payload || !payload.id) {
      return NextResponse.json({ user: null });
    }

    const prisma = new PrismaClient();
    const user = await prisma.user.findUnique({
      where: {
        id: payload.id,
      },
      select: {
        id: true,
        email: true,
        username: true,
      },
    });

    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ user: null });
  }
}
