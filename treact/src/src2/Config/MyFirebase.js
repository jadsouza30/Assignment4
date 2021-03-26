import firebase from 'firebase'

const config = {
    apiKey: "AIzaSyCrpNFY_JEh_2ebDDz7pGTcp4t7sWf53N4",
    authDomain: "cs310project-be2f6.firebaseapp.com",
    projectId: "cs310project-be2f6",
    storageBucket: "cs310project-be2f6.appspot.com",
    messagingSenderId: "97936795244",
    appId: "1:97936795244:web:70f7ffdabb00a9f6f01a49",
    measurementId: "G-5EJF6C4R4H"
}
//firebase.initializeApp(config)
firebase.firestore().settings({
    timestampsInSnapshots: true
})

export const myFirebase = firebase
export const myFirestore = firebase.firestore()
export const myStorage = firebase.storage()
