import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET;
  return NextResponse.json({ secret }, { status: 200 });
}
