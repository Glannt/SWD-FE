import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDxHszizaiqVMNzQ0zQ-b1ojHeBdYsEb78",
  authDomain: "swd392-5c9d5.firebaseapp.com",
  projectId: "swd392-5c9d5",
  storageBucket: "swd392-5c9d5.firebasestorage.app",
  messagingSenderId: "321128844526",
  appId: "1:321128844526:web:db6f96188b19464ca9b7ff",
  measurementId: "G-EKP0LE9N43",
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
export const analytics = getAnalytics(app);
