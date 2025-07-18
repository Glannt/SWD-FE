import { createContext, useContext, useState, ReactNode } from "react";
import { MessagePayload } from "firebase/messaging";

type Notification = {
  id: string;
  title: string;
  body: string;
  read: boolean;
  receivedAt: number;
};

type NotificationContextType = {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (payload: MessagePayload) => void;
  markAllAsRead: () => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (payload: MessagePayload) => {
    setNotifications((prev) => [
      {
        id: Date.now().toString(),
        title: payload.notification?.title || "Thông báo",
        body: payload.notification?.body || "",
        read: false,
        receivedAt: Date.now(),
      },
      ...prev,
    ]);
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, addNotification, markAllAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error("useNotification must be used within NotificationProvider");
  return ctx;
};
