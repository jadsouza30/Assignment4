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

export const getMeetingFromDB=async (id)=>{
    const query=await firebase.firestore().collection("Events").where("MeetingNumber","==",id.toString()).get()
    if(query.docs.length===0)return null
    return query.docs[0].data()
}

export const errorComponent=()=>{
    return true
}