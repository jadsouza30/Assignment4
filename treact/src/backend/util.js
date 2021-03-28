import firebase from "firebase"

export const getUser= ()=>{
    return new Promise((resolve,reject)=>
    {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          resolve(user)
        } else {
          resolve(null)
        }
      });
    })
}

export const errorComponent=()=>{
    return true
}