/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Active Sessions Management Page
 *
 * Displays a list of the user's active sessions with expiration times.
 * Allows the user to log out from all devices.
 *
 * In development mode (when `NEXT_PUBLIC_DEV_MODE=true`), displays dummy data
 * to enable UI/UX work without requiring real authentication.
 */

"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";
import api from "@/lib/api";

    const isDevMode =  "true";

/**
 * Represents an active user session.
 */
interface Session {
  id: string;
  createdAt: string;
  expires: string;
}

/**
 * Active Sessions page component.
 *
 * - Fetches session data on mount (or uses dummy data in dev mode)
 * - Provides "Logout All" action to invalidate all sessions
 * - Automatically redirects to login if user is not authenticated (in production)
 */
export default function SessionsPage() {
  const { isAuthenticated, loading: authLoading } = useAuthStore();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dummy data for development
  const dummySessions: Session[] = [
    // {
    //   id: "sess_1",
    //   createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    //   expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    // },
    // {
    //   id: "sess_2",
    //   createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    //   expires: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    // },
  ];

  /**
   * Fetches active sessions from the backend.
   */
  const fetchSessions = async () => {
    try {
      const res = await api.get("/auth/sessions");
      setSessions(res.data);
    } catch (err: any) {
      setError("Failed to load sessions. Please try again later.");
      console.error("Sessions fetch error:", err);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {

    if (isDevMode) {
      setTimeout(() => {
        setSessions(dummySessions);
        setLoading(false);
      }, 300);
    } else {
      fetchSessions();
    }
  }, [authLoading]);

  if (authLoading && process.env.NEXT_PUBLIC_DEV_MODE !== "true") {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Active Sessions</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {loading ? (
        <p>Loading sessions...</p>
      ) : sessions.length > 0 ? (
        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="p-4 border rounded-lg bg-background-light dark:bg-surface-dark"
            >
              <p className="text-sm text-gray-500">
                Created: {new Date(session.createdAt).toLocaleString()}
              </p>
              <p className="font-medium">
                Expires: {new Date(session.expires).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No active sessions found.</p>
      )}


    </div>
  );
}