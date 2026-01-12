"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth";

export default function SessionsPage() {
  const { fetchSessions, sessions, logoutAll } = useAuthStore();

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <>
      <h2>Active Sessions</h2>
      {sessions.map((s) => (
        <div key={s.id}>
          Expires: {new Date(s.expires).toLocaleString()}
        </div>
      ))}
      <button onClick={logoutAll}>Logout All</button>
    </>
  );
}
