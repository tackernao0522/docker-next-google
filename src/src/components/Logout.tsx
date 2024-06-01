"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const Logout = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  if (status === "authenticated") {
    return (
      <div>
        <button onClick={handleLogout}>ログアウト</button>
      </div>
    );
  }
  return null;
};

export default Logout;
