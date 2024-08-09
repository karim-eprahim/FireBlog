import firebase from "firebase/app";
import "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyD6HxhpRcxgV1tXXt8LS5ZQzSb5prIPPX8",
    authDomain: "fireblogs-95a5e.firebaseapp.com",
    projectId: "fireblogs-95a5e",
    storageBucket: "fireblogs-95a5e.appspot.com",
    messagingSenderId: "154827836659",
    appId: "1:154827836659:web:358ed4255fe603e988fb86"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig)
const timetamp = firebase.firestore.FieldValue.serverTimestamp

export {timetamp}
export default firebaseApp.firestore()