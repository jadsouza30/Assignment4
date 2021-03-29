import React,{useState} from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import tw from "twin.macro";
import styled from "styled-components"; //eslint-disable-line
import { css } from "styled-components/macro"; //eslint-disable-line
import Header from "components/headers/light.js";
import Footer from "components/footers/FiveColumnWithInputForm.js";
import MainFeature1 from "components/features/TwoColWithButton.js";
// import MainFeature2 from "components/features/TwoColSingleFeatureWithStats.js";
// import MainFeature3 from "components/features/TwoColSingleFeatureWithStats2.js";
import Features from "components/features/ThreeColSimple.js";
// import Features from "components/features/ThreeColWithSideImage.js";
import TeamCardGrid from "components/cards/ProfileThreeColGrid.js";

import SupportIconImage from "images/support-icon.svg";
import ShieldIconImage from "images/shield-icon.svg";
import CustomerLoveIconImage from "images/simple-icon.svg";
import firebase from "firebase";

const Subheading = tw.span`uppercase tracking-wider text-sm`;

export default (profile) => {
      let err=[<MainFeature1
          heading="No Events Found"
          imageSrc="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=768&q=80"
        />,
      ];

      let id=profile;
      let otherID=0
      let uid=0
      let friends;

      function friend(){
        ////alert(otherID)
        firebase.firestore().collection("users").doc(uid).get()
        .then((doc)=>{
          var friends=doc.data().friends;
          friends.push(otherID);
          firebase.firestore().collection("users").doc(uid).set({friends:friends})
          .then((res)=>{
            window.location.href="../main"
          })
        })
      }

      const [features,setFeatures]=useState([])
      var loaded=false

      firebase.auth().onAuthStateChanged((user) => {
        if (user && loaded===false) {
          loaded=true;
          var dat=[];
          var proms;
          var text="Join Meeting"
          uid=user.uid

          if(id==="profile" || id==uid)
          {
            text="Start Meeting"
            id=user.uid;
            proms=firebase.firestore().collection("Events").where("uid","==",id).get()
          }
          else if(id==="feed")
          {
            proms=firebase.firestore().collection("users").doc(uid).get()
              .then((doc)=>{
                if(doc.data().friends.length==1)return firebase.firestore().collection("Events").where("uid","in",doc.data().friends).get()
                else return Promise.reject("err");
              }
            );
          }
          else
          {
            firebase.firestore().collection("users").doc(id).get()
            .then((doc)=>{
              otherID=doc.data().uid
              var name;
              if(doc.data().name!==null)name=doc.data.name
              else if(doc.data().nickname!=null)name=doc.data().nickname
              else name="Person"
              dat.push(
                <MainFeature1
                  heading={name}
                  imageSrc={doc.data().photoUrl==null?ShieldIconImage:doc.data().imgSrc}
                  buttonRounded={true}
                  primaryButtonText={'Add to Friends'}
                  primaryButtonUrl={"#"}
                  onClick={friend}
                />
              )
            });
            proms=firebase.firestore().collection("Events").where("uid","==",id).get()
          }

          proms.then((querySnapshot)=>{
            if(!querySnapshot.docs.length) return Promise.reject("err");
            let i=0
            querySnapshot.docs.forEach(
              doc => {
                dat.push(
                  <MainFeature1
                    key={i++}
                    subheading={<Subheading>{doc.data().category}</Subheading>}
                    heading={doc.data().title}
                    buttonRounded={false}
                    primaryButtonText={text}
                    primaryButtonUrl={"../Meeting/landing/"+doc.data().MeetingNumber}
                    imageSrc={doc.data().imgSrc}
                    textOnLeft={false}
                  />
                )
            }
          );
            if(dat.length==0)
            {
              dat.push(err[0])
              setFeatures(dat)
            }
            else{
              setFeatures(dat);
            }
          })
          .catch((errno)=>{dat.push(err[0]);setFeatures(dat)});
        }
        else if(loaded==false)window.location.href="http://localhost:3000/components/innerPages/LoginPage"
        });
  
      return (
    <AnimationRevealPage>
      <Header />

      {features}
      <Footer />
    </AnimationRevealPage>
  );
};
