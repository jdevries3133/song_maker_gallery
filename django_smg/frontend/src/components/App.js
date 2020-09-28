import React, { Component } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import { Provider } from "react-redux";
import store from "../store";

import LandingPage from "./landing_page/landing_page";
import PrivateRoute from "./generics/private_route";
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
              <SignUp title="Sign Up" />
            </Route>
            <Route path="/login">
              <Login title="Login" />
            </Route>
            <Route path="/gallery/*">
              <Gallery />
            </Route>
            <PrivateRoute path="/teacher">
              <Teacher title="Gallery Management Console" />
            </PrivateRoute>
          </Switch>
        </Router>
      </Provider>
    );
  }
}

export default App;
