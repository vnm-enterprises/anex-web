import { create } from "zustand";

type Notification = {
  id: string;
  message: string;
  read: boolean;
};

type NotificationState = {
  notifications: Notification[];
  unreadCount: number;

  markRead: (id: string) => void;
  addNotification: (message: string) => void;
};

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (message) =>
    set((state) => ({
      notifications: [
        { id: crypto.randomUUID(), message, read: false },
        ...state.notifications,
      ],
      unreadCount: state.unreadCount + 1,
    })),

  markRead: (id) =>
    set((state) => {
      const updated = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );

      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.read).length,
      };
    }),
}));
