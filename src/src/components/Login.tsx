"use client";

import React, { useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const Login = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status !== "authenticated") {
    return (
      <div>
        <p>あなたはログインしていません</p>
        <button onClick={() => signIn("google", {}, { prompt: "login" })}>
          Googleでログイン
        </button>
      </div>
    );
  }
  return null;
};

export default Login;
