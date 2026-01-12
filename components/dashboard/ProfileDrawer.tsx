"use client";

import SessionsPage from "../auth/sessions";

export default function ProfileDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {/* Backdrop (important for mobile UX) */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40"
        />
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

        {/* Profile Info */}
        <div className="p-6 flex flex-col items-center text-center gap-3">
          <img
            src="https://images.unsplash.com/photo-1599566150163-29194dcaad36"
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover ring-2 ring-primary/40"
          />

          <div>
            <p className="font-bold text-gray-900 dark:text-white">
              Mr. Perera
            </p>
            <p className="text-sm text-gray-500">
              Landlord · Colombo
            </p>
          </div>
        </div>

        {/* Account Details */}
        <div className="px-6 space-y-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Email</span>
            <span className="font-medium text-gray-900 dark:text-white">
              perera@gmail.com
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Phone</span>
            <span className="font-medium text-gray-900 dark:text-white">
              +94 77 123 4567
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto p-6 space-y-3 border-t border-gray-100 dark:border-gray-800">
          {/* <button
            className="w-full py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800
            hover:bg-gray-100 dark:hover:bg-gray-700
            text-sm font-semibold transition"
          >
            View Profile
          </button> */}

          <button
            className="w-full py-2.5 rounded-lg
            text-sm font-semibold text-red-600
            hover:bg-red-50 dark:hover:bg-red-900/20 transition"
          >
            Logout
          </button>
        </div>
        <SessionsPage />
      </div>
    </>
  );
}
