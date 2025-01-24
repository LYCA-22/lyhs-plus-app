import { initializeApp } from "firebase/app";
import { getFirestore, getDocs, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "lyhsplus.firebaseapp.com",
  projectId: "lyhsplus",
  storageBucket: "lyhsplus.firebasestorage.app",
  messagingSenderId: "601287085429",
  appId: "1:601287085429:web:452599c88e628c92cc573c",
  measurementId: "G-27N03YHGBP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

interface Proposal {
  id: string;
  title?: string;
  content?: string;
  createdAt?: string;
}

// 獲取指定集合的所有文檔
export async function getDocsFromCollection(collectionName: string) {
  const querySnapshot = await getDocs(collection(db, collectionName));
  const proposalsData: Proposal[] = [];
  querySnapshot.forEach((doc) => {
    proposalsData.push({
      id: doc.id,
      ...doc.data(),
    });
  });
  return proposalsData;
}
