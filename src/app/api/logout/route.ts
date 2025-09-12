import { NextResponse } from "next/server";
import { getEpochDate } from "@/lib/helpers";

export async function POST() {
  const res = NextResponse.json({ success: true });
  // Use Unix Epoch time (Jan 1, 1970) to expire the cookie immediately
  res.cookies.set("token", "", { httpOnly: true, expires: getEpochDate() });
  return res;
}
