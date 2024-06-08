// route.ts 3
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function DELETE(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const response = await axios.delete(`${apiUrl}/users/${email}`);
    if (response.status === 204) {
      return NextResponse.json(
        { message: "User deleted successfully" },
        { status: 204 }
      );
    } else {
      return NextResponse.json(
        { error: "Failed to delete user" },
        { status: response.status }
      );
    }
  } catch (error: any) {
    console.error(
      "Error deleting user:",
      error.response ? error.response.data : error.message
    );
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
