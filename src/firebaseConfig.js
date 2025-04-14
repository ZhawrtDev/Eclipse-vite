import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase, ref, set, remove, get, update, push } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBMf5YeyllRNE5t6PuM5tVSLHCHG06Ds-c",
  authDomain: "ryzeon---eclipse.firebaseapp.com",
  databaseURL: "https://ryzeon---eclipse-default-rtdb.firebaseio.com",
  projectId: "ryzeon---eclipse",
  storageBucket: "ryzeon---eclipse.firebasestorage.app",
  messagingSenderId: "281363104564",
  appId: "1:281363104564:web:d41a2ff01701e05c755b61",
  measurementId: "G-VPMK9N7HDF"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const database = getDatabase(app);

export { auth, firestore, database, ref, set, remove, get, update, push };
