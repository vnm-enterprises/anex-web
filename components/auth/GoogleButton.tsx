"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";

export default function GoogleButton() {
  const router = useRouter();
  const loginWithGoogle = useAuthStore((s) => s.loginWithGoogle);

  return (
    <GoogleLogin
      onSuccess={async (res) => {
        if (!res.credential) return;

        await loginWithGoogle(res.credential);
        router.push("/dashboard");
      }}
      onError={() => {
        console.error("Google login failed");
      }}
    />
  );
}
