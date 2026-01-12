"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { authApi } from "@/api/auth";

export default function ResetPasswordPage() {
  const token = useSearchParams().get("token")!;
  const [password, setPassword] = useState("");

  const submit = async () => {
    await authApi.resetPassword(token, password);
    alert("Password updated");
  };

  return (
    <>
      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={submit}>Reset Password</button>
    </>
  );
}
