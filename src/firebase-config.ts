import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDETsfdoxK8YhmRLuDTzlOyR31XSf76j4Y",
  authDomain: "db-wsb-project.firebaseapp.com",
  projectId: "db-wsb-project",
  storageBucket: "db-wsb-project.firebasestorage.app",
  messagingSenderId: "816941944331",
  appId: "1:816941944331:web:8db1dc09af420aa9ee410e",
  measurementId: "G-F6NMTJX2DZ",
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
