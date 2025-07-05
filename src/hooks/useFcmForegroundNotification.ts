import { useEffect } from "react";
import { messaging } from "../firebase-config";
import { onMessage, MessagePayload } from "firebase/messaging";

export const useFcmForegroundNotification = (
  onNotify: (payload: MessagePayload) => void
) => {
  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      onNotify(payload);
    });
    return unsubscribe;
  }, [onNotify]);
};
