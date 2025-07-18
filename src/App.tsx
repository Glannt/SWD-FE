import { Toaster, toast } from "react-hot-toast";
import { useFcmForegroundNotification } from "./hooks/useFcmForegroundNotification";
import { useNotification } from "./context/NotificationContext";
import { useFcmToken } from "./hooks/useFcmToken";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/route.tsx";
import { useEffect, useState } from "react";
import { NotificationPermissionModal } from "./components/common/NotificationPermissionModal";

export default function App() {
  const { addNotification } = useNotification();
  const jwt = localStorage.getItem("access_token");
  const [showModal, setShowModal] = useState(false);
  const registerFcmToken = useFcmToken(jwt);

  useFcmForegroundNotification((payload) => {
    addNotification(payload);

    toast(payload.notification?.title + ": " + payload.notification?.body);
  });

  useEffect(() => {
    if (!jwt) {
      setShowModal(false);
      return;
    }
    if (Notification.permission === "default") {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [jwt]);

  return (
    <div className="relative min-h-screen">
      <Toaster />
      <NotificationPermissionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onEnable={registerFcmToken}
      />
      <RouterProvider router={router} />
    </div>
  );
}
