import firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyA__HzNvBmWSCGF6Hzrdbq5B6iMhT7M5Xk",
    authDomain: "react-firebase-auth-7efa9.firebaseapp.com",
    projectId: "react-firebase-auth-7efa9",
    storageBucket: "react-firebase-auth-7efa9.appspot.com",
    messagingSenderId: "44685723325",
    appId: "1:44685723325:web:17be758281557599d359d4",
    measurementId: "G-GHZPHRJH6L"
  };

  const fire = firebase.initializeApp(firebaseConfig);

  export default fire;