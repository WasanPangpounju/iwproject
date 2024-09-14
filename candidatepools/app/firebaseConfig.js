import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyB7ysl9_wuazRRVslpsXGEPElf5qlwmd5Y",
    authDomain: "iwproject-3fb0f.firebaseapp.com",
    projectId: "iwproject-3fb0f",
    storageBucket: "iwproject-3fb0f.appspot.com",
    messagingSenderId: "922644439581",
    appId: "1:922644439581:web:a6f43487739eaddf341cf4",
    measurementId: "G-0KK2M0PC69"
};


const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };

