import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"; // 必要に応じて変更

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
      console.log("SignIn callback called with:");
      console.log("User:", user);
      console.log("Account:", account);
      console.log("Profile:", profile);

      const provider = account?.provider;
      const uid = account?.providerAccountId || account?.sub; // Adjusted to use providerAccountId
      const name = user.name;
      const email = user.email;

      console.log("Provider:", provider);
      console.log("UID:", uid);
      console.log("Name:", name);
      console.log("Email:", email);

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

        console.log("Response from Rails:", response.status, response.data);

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
      console.log("JWT callback called with user:", user);
      if (user) {
        token.user = {
          id: user.id, // Adjust according to your user object structure
          name: user.name,
          email: user.email,
          image: user.image,
        };
      }
      return token;
    },
    async session({ session, token }) {
      console.log("Session callback called with token:", token);
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
export async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.query as { email: string };
  try {
    const response = await axios.delete(`${apiUrl}/users`, {
      data: { email },
    });

    if (response.status === 204) {
      res.status(204).end();
    } else {
      res.status(response.status).json({ error: "Failed to delete user" });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
