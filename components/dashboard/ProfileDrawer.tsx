"use client";

import { useAuthStore } from "@/store";
import SessionsPage from "../auth/sessions";
import { useState } from "react";
import api from "@/lib/api";
import {
  Edit3,
  Key,
  LogOut,
  Mail,
  Monitor,
  Phone,
  RotateCcw,
  ShieldCheck,
  User,
} from "lucide-react";
import EditProfileModal from "./EditProfileModal";
import ChangePasswordModal from "./ChangePasswordModal";

export default function ProfileDrawer({
  open,
  onClose,
  edit,
  change
}: {
  open: boolean;
  onClose: () => void;
  edit: (v: boolean) => void;
  change: (v: boolean) => void
}) {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");
  const [isLoggingOut, setIsLogginOut] = useState(false);
  const hydrateUser = useAuthStore((s) => s.hydrateUser);



  /**
   * Handle logout from all devices.
   */
  const handleLogoutAll = async () => {
    try {
      await api.post("/auth/logout-all");
      logout();
      onClose();
      hydrateUser();
    } catch (error) {
      console.error("Logout all failed:", error);
      logout();
      onClose();
    }
  };

  /**
   * Handle single session logout (not implemented here — optional future enhancement).
   */
  const handleLogoutCurrent = async () => {
    try {
      await api.post("/auth/logout");
      logout();
      onClose();
      hydrateUser();
    } catch (error) {
      console.error("Logout failed:", error);
      logout();
      onClose();
    }
  };

  const setIsEditProfileOpen = (val: boolean)  =>{
    edit(val);
  }

  const setIsChangePasswordOpen = (val: boolean) => {
    change(val);
  }

  return (
    <>
      {/* Backdrop (important for mobile UX) */}
      {open && (
        <div onClick={onClose} className="fixed inset-0 bg-black/40 z-40" />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-80 max-w-full
        bg-white dark:bg-surface-dark
        shadow-xl transform transition-transform duration-300 z-50
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h3 className="font-bold text-lg">Profile</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 dark:hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="px-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab("profile")}
              className={`py-3 px-1 text-sm font-medium relative ${
                activeTab === "profile"
                  ? "text-primary dark:text-primary"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Profile
              {activeTab === "profile" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`py-3 px-1 text-sm font-medium relative ${
                activeTab === "security"
                  ? "text-primary dark:text-primary"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Security
              {activeTab === "security" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === "profile" ? (
            <div className="space-y-6">
              {/* Avatar & Name */}
              <div className="flex flex-col items-center text-center gap-3 pb-4">
                <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  {user?.avatar ? (
                    <img
                      src={user?.avatar}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="text-gray-500" size={28} />
                  )}
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">
                    {user?.name || "User"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {user?.emailVerified ? (
                      <span className="flex items-center gap-1 justify-center">
                        <ShieldCheck size={14} className="text-green-500" />
                        Email verified
                      </span>
                    ) : (
                      "Email not verified"
                    )}
                  </p>
                </div>
              </div>

              {/* Account Details */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="text-gray-400 mt-0.5" size={18} />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user?.email}
                    </p>
                  </div>
                </div>

                {user?.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="text-gray-400 mt-0.5" size={18} />
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user?.phone}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button
                  onClick={() => {
                    onClose();
                    setIsEditProfileOpen(true)
                  }}
                  className="w-full flex items-center gap-2 py-2.5 px-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-left transition"
                >
                  <Edit3 size={16} />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Edit Profile
                  </span>
                </button>

                <button
                  onClick={() => setIsChangePasswordOpen(true)}
                  className="w-full flex items-center gap-2 py-2.5 px-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-left transition"
                >
                  <Key size={16} />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Change Password
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Monitor size={18} />
                Active Sessions
              </h4>

              <SessionsPage />

              <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                <button
                  onClick={handleLogoutAll}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/30 text-sm font-medium transition"
                >
                  <RotateCcw size={16} />
                  Log Out From All Devices
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-5 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={handleLogoutCurrent}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition disabled:opacity-60"
          >
            <LogOut size={16} />
            {isLoggingOut ? "Logging out..." : "Log out"}
          </button>
        </div>
      </div>


    </>
  );
}
