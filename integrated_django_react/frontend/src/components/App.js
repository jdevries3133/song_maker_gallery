import React, { Component } from "react";
import "./App.css";
import LandingPage from "./landing_page/landing_page";

import SignUp from "./signup-login/signup";
import Login from "./signup-login/login";

class App extends Component {
  render() {
    return (
      <div>
        {/* <LandingPage /> */}
        {/* <SignUp /> */}
        <Login />
      </div>
    );
  }
}

export default App;
