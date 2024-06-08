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

      // 204 No Contentの場合、axiosはresponse.dataが空なので、特別に処理
      if (
        response.status === 204 ||
        (response.data && response.data.message === "User deleted successfully")
      ) {
        console.log("アカウントが正常に削除されました");
        signOut();
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
