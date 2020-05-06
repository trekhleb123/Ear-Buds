import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  // copy and paste your firebase credential here
  apiKey: 'AIzaSyBYMe0vrHWmvoWoMrZGB62EXeEhgdNVZvM',
  authDomain: "podcastparty-402e2.web.app",
  databaseURL: "https://podcastparty-402e2.firebaseio.com",
  projectId: "podcastparty-402e2",
  storageBucket: "gs://podcastparty-402e2.appspot.com",
  messagingSenderId: '311285409494'
});

const db = firebaseApp.firestore();

export { db };
