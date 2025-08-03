import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAaY7DlAq_pDAHd0cO59CaH74zBt-m7kNo",
  authDomain: "yhys-7f303.firebaseapp.com",
  projectId: "yhys-7f303",
  storageBucket: "yhys-7f303.firebasestorage.app",
  messagingSenderId: "681655520816",
  appId: "1:681655520816:web:9d9bf1875e4cfd277167f5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
