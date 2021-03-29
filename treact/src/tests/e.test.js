import React from 'react';
import "firebase";
import Login from '../login/config/Login';
import {render, fireEvent} from '@testing-library/react';

describe("login testcase", () => {
    
    it("should render login component", () => {
        //const props = { name: "Vignesh", place: "Bangalore", location: { pin: '12345'}};
        //const { location: { pin } } = props;
        const {getByTestId} = render(<Login />); //{} = render returns an object.
        expect(getByTestId("login-container")).toBeTruthy();
    });

    it("should render Email input field", () => {
        const {getByTestId} = render(<Login />); //{} = render returns an object.
        expect(getByTestId("email")).toBeTruthy();
    });

    it("should render Password input field", () => {
        const {getByTestId} = render(<Login />); //{} = render returns an object.
        expect(getByTestId("password")).toBeTruthy();
    });


    it("should render Login button", () => {
        const {getByTestId} = render(<Login />); //{} = render returns an object.
        expect(getByTestId("login-button")).toBeTruthy();
    });

    it("should render Signup button", () => {
        const {getByTestId} = render(<Login />); //{} = render returns an object.
        expect(getByTestId("signup-button")).toBeTruthy();
    });




    /*it("should call login onclick login button", () => {
        const login= jest.fn();
        const {getByTestId} = render(<Login />); //{} = render returns an object.
        fireEvent.click(getByTestId('login-button'));
        expect(login).toHaveBeenCalled();
    });*/
    
    // Login folder -> Login.jsx, Login.test.js, index.js

    // index.js
    // import Login from './Login
    /*it("a", () => {
    const logintest = TestRenderer.create(<Login></Login>);

    jest.mock('./firebase', () => {
        var b = jest.fn();
        return {
            1
        }

    });
    let v = logintest.toJSON();
    expect(v).toHaveBeenCalledTimes(1);
    });*/
  });
