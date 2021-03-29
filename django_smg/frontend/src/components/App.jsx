import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { Provider } from "react-redux";
import store from "../store";

import { Title } from "./common/set_page_title";

import { LandingPage } from "./landing_page";
import PrivateRoute from "./common/private_route";
import SignUp from "./auth/signup";
import Login from "./auth/login";
import Gallery from "./gallery/gallery";
import Teacher from "./teacher";
import { Footer } from "./common/footer";
import { TosPage, PrivacyPage } from "./legal";

const App = () => (
  <Provider store={store}>
    <Router>
      <Switch>
        <Route exact path="/">
          <LandingPage />
        </Route>
        <Route path="/signup">
          <Title is="Sign Up">
            <SignUp />
            <Footer />
          </Title>
        </Route>
        <Route path="/login">
          <Title is="Login">
            <Login />
            <Footer />
          </Title>
        </Route>
        <Route path="/gallery/*">
          <Gallery />
        </Route>
        <Route path="/privacy/*">
          <Title is="Privacy Policy">
            <PrivacyPage />
          </Title>
        </Route>
        <Route path="/tos/*">
          <Title is="Terms of Service">
            <TosPage />
          </Title>
        </Route>
        <PrivateRoute path="/teacher">
          <Title is="Gallery Management Console">
            <Teacher />
            <Footer />
          </Title>
        </PrivateRoute>
      </Switch>
    </Router>
  </Provider>
);

export default App;
