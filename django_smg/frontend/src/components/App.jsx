import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { Provider } from "react-redux";
import store from "../store";

import "../../static/frontend/global_styles.css";

import { Title } from "Common/set_page_title";
import { LandingPage } from "./landing_page";
import PrivateRoute from "Common/private_route";
import SignUp from "./auth/signup";
import Login from "./auth/login";
import Gallery from "./gallery/gallery";
import { SongSubmitForm } from "./gallery/submit_song";
import Teacher from "./teacher";
import { Footer } from "Common/footer";
import { TosPage, PrivacyPage } from "./legal";
import { NotFound } from "Common/error";
import { ServiceInterruption } from "Common/service_interruption";

const App = () => (
  <Provider store={store}>
    <ServiceInterruption />
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
        <Route path="/gallery/:slug/submit-song/">
          <SongSubmitForm />
        </Route>
        <Route path="/gallery/:slug/">
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
        <Route path="/*">
          <NotFound />
        </Route>
      </Switch>
    </Router>
  </Provider>
);

export default App;
