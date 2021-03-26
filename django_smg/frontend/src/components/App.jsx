import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { Provider } from "react-redux";
import store from "../store";

import LandingPage from "./landing_page/landing_page";
import PrivateRoute from "./generics/private_route";
import SignUp from "./signup-login/signup";
import Login from "./signup-login/login";
import Gallery from "./gallery/gallery";
import Teacher from "./teacher";
import { Footer } from "./generics/footer";
import { TosPage, PrivacyPage } from "./legal";

const App = () => (
  <Provider store={store}>
    <Router>
      <Switch>
        <Route exact path="/">
          <LandingPage />
        </Route>
        <Route path="/signup">
          <SignUp title="Sign Up" />
          <Footer />
        </Route>
        <Route path="/login">
          <Login title="Login" />
          <Footer />
        </Route>
        <Route path="/gallery/*">
          <Gallery />
        </Route>
        <Route path="/privacy/*">
          <PrivacyPage />
        </Route>
        <Route path="/tos/*">
          <TosPage title="Terms of Service" />
        </Route>
        <PrivateRoute path="/teacher">
          <Teacher title="Gallery Management Console" />
          <Footer />
        </PrivateRoute>
      </Switch>
    </Router>
  </Provider>
);

export default App;
