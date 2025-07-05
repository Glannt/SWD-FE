import { useNotification } from "../context/NotificationContext";
import { useState } from "react";

const NotificationBell = () => {
  const { unreadCount, notifications, markAllAsRead } = useNotification();
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen((prev) => !prev);
    if (!open) markAllAsRead();
  };

  return (
    <div className="relative inline-block text-left">
      <button
        className="relative focus:outline-none"
        aria-label="Notifications"
        tabIndex={0}
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleToggle();
        }}
      >
        <svg
          className="w-7 h-7 text-gray-700"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">
            {unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg z-50 border border-gray-200">
          <div className="p-2 font-semibold border-b">Thông báo</div>
          {notifications.length === 0 ? (
            <div className="p-4 text-gray-500 text-sm">
              Không có thông báo mới.
            </div>
          ) : (
            notifications.slice(0, 5).map((n) => (
              <div
                key={n.id}
                className={`p-3 border-b last:border-b-0 ${
                  n.read ? "bg-gray-50" : "bg-orange-50"
                }`}
              >
                <div className="font-medium text-gray-900">{n.title}</div>
                <div className="text-sm text-gray-600">{n.body}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(n.receivedAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
          <button
            className="w-full py-2 text-center text-sm text-orange-600 hover:bg-orange-50 rounded-b-lg"
            onClick={() => setOpen(false)}
          >
            Đóng
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
