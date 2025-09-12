import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}

export function signJwt(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

type UserPayload = {
  id: string;
  email: string;
  iat: number;
  exp: number;
};

export function verifyJwt(token: string): UserPayload | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as UserPayload;
    if (!payload || !payload.id) {
      return null;
    }

    const currentTime = Date.now() / 1000; // Current time in seconds since epoch

    if (payload.exp < currentTime) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export interface SessionUser {
  id: number;
  username: string;
  email: string;
}

export interface Session {
  user: SessionUser;
}

/**
 * Get the current user session from the server
 * Use this in server components or API routes
 */
export async function getServerSession(): Promise<Session | null> {
  try {
    // Get the token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return null;
    }

    // Verify the token
    const payload = verifyJwt(token);
    if (!payload) {
      return null;
    }

    // Get the user from the database
    const user = await prisma.user.findUnique({
      where: { id: Number(payload.id) },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    if (!user) {
      return null;
    }

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  } catch (error) {
    console.error("Error getting server session:", error);
    return null;
  }
}
