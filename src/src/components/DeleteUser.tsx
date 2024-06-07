import axios from "axios";
import { signOut, useSession } from "next-auth/react";

const DeleteUser = async () => {
  const { data: session } = useSession();

  const handleDeleteUser = async () => {
    if (!session || !session.user) {
      console.error("セッションが存在しません");
      return;
    }

    try {
      const response = await axios.delete(
        `/api/auth?email=${session.user.email}`
      );

      if (response.status === 204) {
        signOut();
      } else {
        console.error("アカウント削除に失敗しました");
      }
    } catch (error) {
      console.log("何らかの問題があります", error);
    }
  };

  if (session) {
    return (
      <div>
        <button onClick={() => handleDeleteUser()}>アカウントを削除する</button>
      </div>
    );
  }
  return null;
};

export default DeleteUser;
