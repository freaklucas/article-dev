import { initializeApp } from "firebase/app";
import { getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.API_KEY_FIREBASE,
  authDomain: process.env.AUTH_DOMAIN_FIREBASE,
  projectId: process.env.PROJECT_ID_FIREBASE,
  storageBucket: process.env.STORAGE_BUCKET_FIREBASE,
  messagingSenderId: process.env.MESSAGING_SENDER_ID_FIREBASE,
  appId: process.env.APP_ID_FIREBASE
};


const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);

export {db};