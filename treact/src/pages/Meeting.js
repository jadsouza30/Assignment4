import React, { useState } from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import { Container, ContentWithPaddingXl } from "components/misc/Layouts";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro";
import Header from "components/headers/light.js";
import Footer from "components/footers/FiveColumnWithInputForm.js";
import { SectionHeading } from "components/misc/Headings";
import { PrimaryButton } from "components/misc/Buttons";
import "styles/search.css";
import { FiSearch, FiFilter } from "react-icons/fi";
import Fuse from "fuse.js";
import 'crypto';
import "@zoomus/websdk/dist/css/bootstrap.css";
import "@zoomus/websdk/dist/css/react-select.css";

var signatureEndpoint = 'http://localhost:4000'
var apiKey = 'y79B-jVQTySE6KkGoDc7JA'
var meetingNumber = '9279407407'
var role = 0
var leaveUrl = 'http://localhost:3000'
var userName = 'React'
var userEmail = 'jasondsouza0530@gmail.com'
var passWord = '151381'

function getSignature(id) {
    fetch(signatureEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        meetingNumber: id,
        role: role
      })
    }).then(res => res.json())
    .then(response => {
      startMeeting(response.signature,id)
    }).catch(error => {
      console.error(error)
    })
}

function startMeeting(signature,id) {
    const { ZoomMtg } = require('@zoomus/websdk');

    ZoomMtg.setZoomJSLib('https://source.zoom.us/1.9.1/lib', '/av');
    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareJssdk();

    ZoomMtg.init({
        leaveUrl: leaveUrl,
        isSupportAV: true,
        success: (success) => {
            console.log("here");
            console.log(success)

            ZoomMtg.join({
                signature: signature,
                meetingNumber: id,
                userName: userName,
                apiKey: apiKey,
                userEmail: userEmail,
                passWord: passWord,
                success: (success) => {
                console.log(success)
                },
                error: (error) => {
                console.log(error)
                }
            })
        },
        error: (error) => {
        console.log(error)
        }
    })
}

export default (id) =>{
    getSignature(id);
    return(
        <div>
        </div>
    );
};


const getPlaceholderPost = () => ({
  imageSrc:
    "https://images.unsplash.com/photo-1418854982207-12f710b74003?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1024&q=80",
  category: "Travel Guide",
  date: "April 19, 2020",
  title: "Visit the beautiful Alps in Switzerland",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  url: "https://reddit.com"
});
