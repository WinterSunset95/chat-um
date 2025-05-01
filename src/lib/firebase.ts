// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyACD4MQSbXmqLy8-msGB_L3fgryCISmgM4",
  authDomain: "winter-f3cb5.firebaseapp.com",
  projectId: "winter-f3cb5",
  storageBucket: "winter-f3cb5.firebasestorage.app",
  messagingSenderId: "548025054656",
  appId: "1:548025054656:web:75cdd9a42eb0bdac58c425",
  measurementId: "G-NMT1CZHNGK"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
//export const analytics = getAnalytics(app);
