import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile }) {
      const provider = account?.provider;
      const uid = account?.providerAccountId || account?.sub;
      const name = user.name;
      const email = user.email;

      if (!provider || !uid || !name || !email) {
        console.error("Incomplete account information.");
        return false;
      }

      try {
        const response = await axios.post(
          `${apiUrl}/auth/${provider}/callback`,
          {
            provider,
            uid,
            name,
            email,
          }
        );

        if (response.status === 200) {
          return true;
        } else {
          console.error("Error response from Rails:", response.status);
          return false;
        }
      } catch (error) {
        console.error("Error fetching JWT from Rails:", error);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user;
      }
      return session;
    },
  },
};

const handler = NextAuth(options);

export { handler as GET, handler as POST };

// ユーザー削除エンドポイント
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
      console.error("Failed to delete user:", response.data);
      return NextResponse.json(
        { error: "Failed to delete user", details: response.data },
        { status: response.status }
      );
    }
  } catch (error: any) {
    console.error(
      "Error deleting user:",
      error.response ? error.response.data : error.message
    );
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error.response ? error.response.data : error.message,
      },
      { status: 500 }
    );
  }
}
