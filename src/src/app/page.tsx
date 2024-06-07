"use client";

import { useSession } from "next-auth/react";
import Login from "../components/Login";
import Logout from "../components/Logout";
import Image from "next/image";
import DeleteUser from "@/components/DeleteUser";

const Home = () => {
  const { data: session, status } = useSession();

  return (
    <div>
      <h1>next-rails-google-auth</h1>
      {status === "authenticated" ? (
        <div>
          <p>セッションの期限: {session?.expires}</p>
          {session?.user && (
            <>
              <p>ようこそ、{session.user.name}さん</p>
              <Image
                src={session.user.image ?? "/default-profile.png"}
                alt="プロフィール画像"
                width={50}
                height={50}
                style={{ borderRadius: "50px" }}
              />
            </>
          )}
          <Logout />
          <div>
            <DeleteUser />
          </div>
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
};

export default Home;
