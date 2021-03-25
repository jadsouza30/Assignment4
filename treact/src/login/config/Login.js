import React, { Component } from "react";
import fire from "../../backend/config";
import "./Login.css";
import firebasefunctions from "firebasefunctions";
require("firebase/auth");
require("firebase/database");

var firebaseRef = fire.database().ref();

class Login extends Component {
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.signup = this.signup.bind(this);
    this.state = {
      email: "",
      password: "",
    };
  }
  login(e) {
    e.preventDefault();

    fire
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then((u) => {
        console.log(u);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  signup(e) {
    e.preventDefault();
    fire
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then((u) => {
        firebasefunctions.createUser(
          "Jeff",
          this.state.email,
          "hello world",
          firebaseRef
        );
        console.log(u);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }
  render() {
    return (
      <div className="logincontainer">
        <form>
          <input
            className="emailinput"
            type="email"
            id="email"
            name="email"
            placeholder="enter email address"
            onChange={this.handleChange}
            value={this.state.email}
          />
          <input
            className="pwinput"
            name="password"
            type="password"
            onChange={this.handleChange}
            id="password"
            placeholder="enter password"
            value={this.state.password}
          />
          <div className="buttongroup">
            <button className="loginbutton" onClick={this.login}>
              Login
            </button>
            <button className="signupbutton" onClick={this.signup}>
              Signup
            </button>
          </div>
        </form>
      </div>
    );
  }
}
export default Login;
