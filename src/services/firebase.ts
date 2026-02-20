import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "test",
  authDomain: "test",
  projectId: "test",
  appId: "test",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
