// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace these with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBkOuzfSbBIzwPeVml6L0beUwQCAqltG_o",
  authDomain: "invoice-management-syste-4bf94.firebaseapp.com",
  projectId: "invoice-management-syste-4bf94",
  storageBucket: "invoice-management-syste-4bf94.firebasestorage.app",
  messagingSenderId: "789639561814",
  appId: "1:789639561814:web:d8cde52291e1261a9431f7",
  measurementId: "G-TLBSTY6TZD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Helper function to get the current user's UID (used for Firestore document ID)
export const getCurrentUserId = () => {
    return auth.currentUser ? auth.currentUser.uid : null;
};