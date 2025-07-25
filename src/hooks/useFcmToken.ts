import { getToken } from "firebase/messaging";
import { messaging } from "../firebase-config";

export const useFcmToken = (
  jwt: string | null,
  apiBaseUrl = import.meta.env.VITE_API_URL
) => {
  const registerFcmToken = async () => {
    if (!jwt) return false;
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return false;
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      });
      if (!token) return false;
      await fetch(`${apiBaseUrl}/users/fcm-token`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ fcmToken: token }),
      });
      return true;
    } catch {
      // intentionally ignore FCM registration errors
      return false;
    }
  };
  return registerFcmToken;
};
