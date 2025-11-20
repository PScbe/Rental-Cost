import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyAIHIVv6dJ0LlNqP_0qkYNok7xsbxHgdRY",
    authDomain: "studio-space-rental-database.firebaseapp.com",
    databaseURL: "https://studio-space-rental-database-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "studio-space-rental-database",
    storageBucket: "studio-space-rental-database.appspot.com",
    messagingSenderId: "176375720882",
    appId: "1:176375720882:web:ac012e2d33e8fec5ca52ab",
    measurementId: "G-NWZ18H2CVT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
