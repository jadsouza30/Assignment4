import React, { useState } from 'react';
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import { Container as ContainerBase } from "components/misc/Layouts";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import illustration from "images/signup-illustration.svg";
import logo from "images/logo.svg";
import googleIconImageSrc from "images/google-icon.png";
import twitterIconImageSrc from "images/twitter-icon.png";
import { ReactComponent as SignUpIcon } from "feather-icons/dist/icons/user-plus.svg";
import firebase from "firebase";
import {browserHistory} from "react-router";
import axios from 'axios';

const Container = tw(
  ContainerBase
)`min-h-screen bg-primary-900 text-white font-medium flex justify-center -m-8`;
const Content = tw.div`max-w-screen-xl m-0 sm:mx-20 sm:my-16 bg-white text-gray-900 shadow sm:rounded-lg flex justify-center flex-1`;
const MainContainer = tw.div`lg:w-1/2 xl:w-5/12 p-6 sm:p-12`;
const LogoLink = tw.a``;
const LogoImage = tw.img`h-12 mx-auto`;
const MainContent = tw.div`mt-12 flex flex-col items-center`;
const Heading = tw.h1`text-2xl xl:text-3xl font-extrabold`;
const FormContainer = tw.div`w-full flex-1 mt-8`;

const SocialButtonsContainer = tw.div`flex flex-col items-center`;
const SocialButton = styled.a`
  ${tw`w-full max-w-xs font-semibold rounded-lg py-3 border text-gray-900 bg-gray-100 hocus:bg-gray-200 hocus:border-gray-400 flex items-center justify-center transition-all duration-300 focus:outline-none focus:shadow-outline text-sm mt-5 first:mt-0`}
  .iconContainer {
    ${tw`bg-white p-2 rounded-full`}
  }
  .icon {
    ${tw`w-4`}
  }
  .text {
    ${tw`ml-4`}
  }
`;

const DividerTextContainer = tw.div`my-12 border-b text-center relative`;
const DividerText = tw.div`leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform -translate-y-1/2 absolute inset-x-0 top-1/2 bg-transparent`;

const Form = tw.form`mx-auto max-w-xs`;
const Input = tw.input`w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5 first:mt-0`;
const SubmitButton = styled.button`
  ${tw`mt-5 tracking-wide font-semibold bg-primary-500 text-gray-100 w-full py-4 rounded-lg hover:bg-primary-900 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none`}
  .icon {
    ${tw`w-6 h-6 -ml-2`}
  }
  .text {
    ${tw`ml-3`}
  }
`;
const IllustrationContainer = tw.div`sm:rounded-r-lg flex-1 bg-purple-100 text-center hidden lg:flex justify-center`;
const IllustrationImage = styled.div`
  ${(props) => `background-image: url("${props.imageSrc}");`}
  ${tw`m-12 xl:m-16 w-full max-w-lg bg-contain bg-center bg-no-repeat`}
`;

export default ({
  logoLinkUrl = "#",
  illustrationImageSrc = illustration,
  headingText = "Sign Up For Treact",
  socialButtons = [
    {
      iconImageSrc: googleIconImageSrc,
      text: "Sign Up With Google",
      url: "https://google.com",
    },
    {
      iconImageSrc: twitterIconImageSrc,
      text: "Sign Up With Twitter",
      url: "https://twitter.com",
    },
  ],
  submitButtonText = "Sign Up",
  SubmitButtonIcon = SignUpIcon,
  tosUrl = "#",
  privacyPolicyUrl = "#",
  signInUrl = "#",
}) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [startTime, setStartTime] = useState('')
  const [startDate, setStartDate] = useState('')
  const [category, setCategory] = useState('')
  const [number,setNumber]=useState(0)
  const [imgSrc,setImgSrc]=useState("")

  const submitFunc=()=>{
    var db=firebase.firestore();
    var user = firebase.auth().currentUser;
    var friends;
    console.log(user);
    db.collection('users').doc(user.uid).get().then(doc => {
      friends = doc.data().friends;
    }).then(()=> {
      var links = [];
      friends.forEach(function(element) {
        var l = 'https://api.ravenhub.io/company/szJmGZMXtU/subscribers/' + element + '/events/Y0cBxL0ADz'
        links.push(l);
      });
      for (const l of links) {
        var name;
        if (user.displayName == null) {
          name = 'Friend' + user.uid;
        } else {
          name = user.displayName;
        }
        var str = name + ' has created an event.'
        const notiObject = {
          msg: str
        };
        fetch(l, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(notiObject)
        }).then(response => console.log(response));
      }
    })
    var found=false;
    var time=startTime+":00";
    var dateTime=startDate+"T"+time;
    var db=firebase.firestore();
    var date=new Date(startDate+" "+startTime);
    var timeStamp=firebase.firestore.Timestamp.fromDate(date);
    alert("here");

    function status(response) {
      if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response)
      } else {
        return Promise.reject(new Error(response.statusText))
      }
    }

    function json(response) {
      return response
    }

    const data={
      name:name,
      description:description,
      startTime:startTime+":00",
      startDate:startDate,
      date:timeStamp,
      category:category,
      imgSrc:imgSrc
    };
    const options={
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    };

    var num;

    axios.post('http://localhost:5001/proevento-69c0b/us-central1/getMeetingID',data,options)
    .then((res)=>{
      console.log(res);
      num=res.data;
      db.collection("Events").add({
        MeetingNumber: `${res.data}`,
        category: category,
        date: dateTime,
        description: description,
        imgSrc: imgSrc,
        startDate:startDate,
        startTime:startTime,
        title:name,
        date:timeStamp
      })
      .then(function(docRef) {
        window.location.href="/Meeting/landing/"+res.data;
      })
      .catch(function(error){
        console.error(error);
      });
    })
  };

  return (
  <AnimationRevealPage>
    <Container>
      <Content>
        <MainContainer>
          <LogoLink href={logoLinkUrl}>
            <LogoImage src={logo} />
          </LogoLink>
          <MainContent>
            <Heading>Create an Event</Heading>
            <FormContainer>
              <Form>
                <Input type="text" placeholder="Event Name" onChange={event => setName(event.target.value)}/>
                <Input type="text" placeholder="Description" onChange={event => setDescription(event.target.value)}/>
                <Input type="time" placeholder="Start Time" onChange={event => setStartTime(event.target.value)}/>
                <Input type="date" placeholder="Start Date" onChange={event => setStartDate(event.target.value)}/>
                <Input type="text" placeholder="Category" onChange={event => setCategory(event.target.value)}/>
                <Input type="number" placeholder="Zoom Meeting ID" onChange={event => setNumber(event.target.value)}/>
                <Input type="text" placeholder="Link to Image" onChange={event => setImgSrc(event.target.value)}/>
                <SubmitButton type="button" onClick={submitFunc}>
                  <SubmitButtonIcon className="icon" />
                  <span className="text">Create</span>
                </SubmitButton>

                <p tw="mt-6 text-xs text-gray-600 text-center">
                  I agree to abide by treact's{" "}
                  <a href={tosUrl} tw="border-b border-gray-500 border-dotted">
                    Terms of Service
                  </a>{" "}
                  and its{" "}
                  <a
                    href={privacyPolicyUrl}
                    tw="border-b border-gray-500 border-dotted"
                  >
                    Privacy Policy
                  </a>
                </p>

                <p tw="mt-8 text-sm text-gray-600 text-center">
                  Already have an account?{" "}
                  <a
                    href={signInUrl}
                    tw="border-b border-gray-500 border-dotted"
                  >
                    Sign In
                  </a>
                </p>
              </Form>
            </FormContainer>
          </MainContent>
        </MainContainer>
        <IllustrationContainer>
          <IllustrationImage imageSrc={illustrationImageSrc} />
        </IllustrationContainer>
      </Content>
    </Container>
  </AnimationRevealPage>
)};
