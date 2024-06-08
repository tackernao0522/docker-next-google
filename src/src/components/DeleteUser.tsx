// src/components/DeleteUser.tsx
import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import React from "react";
import { useRouter } from "next/navigation";

const DeleteUser: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleDeleteUser = async () => {
    if (!session || !session.user) {
      console.error("セッションが存在しません");
      return;
    }

    const confirmed = window.confirm("本当に削除しますか？");
    if (!confirmed) {
      return;
    }

    try {
      const response = await axios.delete(
        `/api/auth/delete?email=${session.user.email}`
      );

      if (response.status === 204) {
        await signOut();
        router.push("/auth/login"); // ログインページへのリダイレクト
      } else {
        console.error("アカウント削除に失敗しました", response.data);
      }
    } catch (error: any) {
      console.error(
        "何らかの問題があります",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div>
      <button onClick={handleDeleteUser}>アカウントを削除する</button>
    </div>
  );
};

export default DeleteUser;
