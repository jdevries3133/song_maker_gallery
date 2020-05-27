import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { Provider } from "react-redux";
import store from "../store";

import LandingPage from "./landing_page/landing_page";
import SignUp from "./signup-login/signup";
import Login from "./signup-login/login";
import Gallery from "./gallery/gallery";
import Teacher from "./teacher/teacher";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Switch>
            <Route exact path="/">
              <LandingPage />
            </Route>
            <Route path="/signup">
              <SignUp />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/gallery">
              <Gallery />
            </Route>
            <Route path="/teacher">
              <Teacher />
            </Route>
          </Switch>
        </Router>
      </Provider>
    );
  }
}

export default App;
