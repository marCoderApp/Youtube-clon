// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBV12Ldf18X9y6bWcQYCBRbnrjnzWu-uC4",
  authDomain: "clon-464d3.firebaseapp.com",
  projectId: "clon-464d3",
  storageBucket: "clon-464d3.appspot.com",
  messagingSenderId: "817011491631",
  appId: "1:817011491631:web:699a8939af506a907557da",
  measurementId: "G-761NHN6TEK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();

export default app;
