import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyCwK5gPDQrBs743b4U1AVD1e7W72091ehw",
  authDomain: "gms-ny-2022-debug.firebaseapp.com",
  projectId: "gms-ny-2022-debug",
  storageBucket: "gms-ny-2022-debug.appspot.com",
  messagingSenderId: "497994751013",
  appId: "1:497994751013:web:16c923fe2d9217dfa6b3cc"
};

const firebaseApp = initializeApp(firebaseConfig);
export const storage = getStorage(firebaseApp);
