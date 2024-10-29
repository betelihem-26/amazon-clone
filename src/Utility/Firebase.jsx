import firebase from "firebase/compat/app";
import { getAuth } from "firebase/auth";
import "firebase/compat/firestore";
import "firebase/compat/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAk1DzSctku9vXTl5YuZUhK9qwlEUwBqGw",
  authDomain: "clone-ad381.firebaseapp.com",
  projectId: "clone-ad381",
  storageBucket: "clone-ad381.appspot.com",
  messagingSenderId: "65880016656",
  appId: "1:65880016656:web:3f6546b1b62dce9fa14795"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
export const auth= getAuth(app)
export const db =app.firestore()


