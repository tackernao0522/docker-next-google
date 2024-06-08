// src/app/auth/login/page.tsx
import React from "react";
import { signIn } from "next-auth/react";

const LoginPage = () => {
  return (
    <div>
      <h1>Login Page</h1>
      <button onClick={() => signIn("credentials")}>Login</button>
    </div>
  );
};

export default LoginPage;
