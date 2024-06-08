import { NextResponse } from "next/server";

export async function GET() {
  const secret = process.env.NEXTAUTH_SECRET;
  return NextResponse.json({ secret });
}
