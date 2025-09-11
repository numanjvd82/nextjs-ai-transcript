import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
  id: number;
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
