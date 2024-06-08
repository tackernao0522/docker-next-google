import { NextResponse } from "next/server";

export async function GET() {
  const secret = process.env.NEXTAUTH_SECRET;
  return NextResponse.json({ secret });
}

export async function POST() {
  return new Response("Method Not Allowed", { status: 405 });
}
