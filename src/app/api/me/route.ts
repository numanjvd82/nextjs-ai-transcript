import { NextResponse } from "next/server";
import { verifyJwt } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
    const payload = verifyJwt(token);
    console.log(payload);

    if (!payload) {
      return NextResponse.json(
        { user: null },
        {
          status: 401,
        }
      );
    }

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
      return NextResponse.json(
        { user: null },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      { user: null },
      {
        status: 500,
      }
    );
  }
}
