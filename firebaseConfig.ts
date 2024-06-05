import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAX0p4VIdtfN7I7dnaOGpBtfGAtlG3IqDY",
  databaseURL: "https://sicaewebapp-default-rtdb.firebaseio.com/",
  projectId: "888070643462",
  appId: "sicaewebapp"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Firebase Realtime Database and get a reference to the service
const database = getDatabase(app);

export { auth, database };
