import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDLgM0C6LeJuodAdkB2xl1v2I11_PF7kQQ",
  authDomain: "amritdayalspices.firebaseapp.com",
  projectId: "amritdayalspices",
  storageBucket: "amritdayalspices.firebasestorage.app",
  messagingSenderId: "899010290895",
  appId: "1:899010290895:web:485c19bbca8dc4e6e503ba",
  measurementId: "G-JZYLCHJB7T"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
