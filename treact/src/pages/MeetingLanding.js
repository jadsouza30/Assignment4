import React, { useState } from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import tw from "twin.macro";
import styled from "styled-components"; //eslint-disable-line
import { css } from "styled-components/macro"; //eslint-disable-line
import Header from "components/headers/light.js";
import Footer from "components/footers/FiveColumnWithInputForm.js";
import MainFeature1 from "components/features/TwoColWithButton.js";
import Features from "components/features/ThreeColSimple.js";
import TeamCardGrid from "components/cards/ProfileThreeColGrid.js";

import SupportIconImage from "images/support-icon.svg";
import ShieldIconImage from "images/shield-icon.svg";
import CustomerLoveIconImage from "images/simple-icon.svg";
import firebase from "firebase";

const Subheading = tw.span`uppercase tracking-wider text-sm`;
export default (id) => {
  const [heading, setHeading] = useState("");
  const [descript,setDescript]=useState("");
  const [primaryButtonLink,setPrimaryButtonLink]=useState("");
  const [imageSr,setImageSrc]=useState("");
  const [startTime,setStartTime]=useState("");
  const [startDate,setStartDate]=useState("");
  const [subheading,setSubHeading]=useState("");
  const [buttonText,setButtonText]=useState("");
 
  var db=firebase.firestore();
  db.collection("Events").where("MeetingNumber", "==", id).limit(1)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            if(heading.length===0|| heading==="Meeting not found")setHeading(heading => doc.data().title+" : "+doc.data().startTime+" "+doc.data().startDate);
            setDescript(descript => doc.data().description);
            var newUrl="/Meeting/event/"+doc.data().MeetingNumber;
            setPrimaryButtonLink(primaryButtonLink => newUrl);
            setStartTime(startTime => doc.data().startTime);
            setStartDate(startDate => doc.data().startDate);
            setImageSrc(imageSr => doc.data().imgSrc);
            setSubHeading(subheading => doc.data().category);
            setButtonText(buttonText=>"Join Meeting")
        });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
  });

  return (
    <AnimationRevealPage>
      <Header />
      <MainFeature1
        subheading={<Subheading>{subheading}</Subheading>}
        heading={heading}
        buttonRounded={false}
        primaryButtonText={buttonText}
        primaryButtonUrl={primaryButtonLink}
        description={descript}
        imageSrc={imageSr}
      />
      <Footer />
    </AnimationRevealPage>
  );
};
