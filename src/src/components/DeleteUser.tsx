import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

const DeleteUser: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleDeleteUser = async () => {
    if (!session || !session.user) {
      console.error("セッションが存在しません");
      return;
    }

    const confirmDeletion = window.confirm("本当に削除しますか？");

    if (!confirmDeletion) {
      return;
    }

    try {
      const response = await axios.delete(
        `/api/auth/delete?email=${session.user.email}`
      );

      if (
        response.status === 204 ||
        (response.data && response.data.message === "User deleted successfully")
      ) {
        console.log("アカウントが正常に削除されました");
        signOut({ redirect: false }); // デフォルトのリダイレクトを無効にする
        router.push("/auth/login"); // 手動でログインページに遷移する
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
