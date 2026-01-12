"use client";

import { useState } from "react";
import { authApi } from "@/api/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const submit = async () => {
    await authApi.forgotPassword(email);
    setSent(true);
  };

  return sent ? (
    <p>Reset link sent if email exists.</p>
  ) : (
    <form onSubmit={(e) => e.preventDefault()}>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <button onClick={submit}>Send reset link</button>
    </form>
  );
}
