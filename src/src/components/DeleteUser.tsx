// DeleteUser.tsx
import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import React from "react";

const DeleteUser: React.FC = () => {
  const { data: session } = useSession();

  const handleDeleteUser = async () => {
    if (!session || !session.user) {
      console.error("セッションが存在しません");
      return;
    }

    try {
      const response = await axios.delete(
        `/api/auth/delete?email=${session.user.email}`
      );

      if (response.status === 204) {
        signOut();
      } else {
        console.error(
          `アカウント削除に失敗しました: ${response.status} ${response.statusText}`
        );
      }
    } catch (error) {
      console.error("何らかの問題があります:", error);
    }
  };

  return (
    <div>
      <button onClick={handleDeleteUser}>アカウントを削除する</button>
    </div>
  );
};

export default DeleteUser;
