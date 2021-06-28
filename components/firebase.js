import firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "auth.presences.sysafarila.tech",
  projectId: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  storageBucket: "xxxxxxxxxxxxxxxxxxxxxxxxxxx",
  messagingSenderId: "xxxxxxxxxxxxxxxxxxxxxxx",
  appId: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  measurementId: "xxxxxxxxxxxxxxxxxxxxxxxxxxx",
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
