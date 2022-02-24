import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { Provider } from "react-redux";
import thunk from "redux-thunk";

import rootReducer from "../../reducers";
import { P } from "Styles";

export const BackendDependentStory = ({ backendPort = 8000, children }) => {
  axios.defaults.baseURL = `http://localhost:${backendPort}/`;
  useEffect(() => {
    console.warn(
      "Did the storybook blow up? Beware: you are viewing a story that is " +
        "depending on the backend being up, running, and potentially " +
        "initialized with some database data!"
    );
  }, []);
  return (
    <>
      <P warn>
        Warning! This component is dependent on the backend. Ensure that the
        backend is running on localhost:{backendPort}, and check the code for
        this specific story to see if the database should be initialized with
        test data!
      </P>
      {children}
    </>
  );
};

BackendDependentStory.propTypes = {
  /* The port axios will go to, and that the warning message will specify */
  backendPort: PropTypes.number,
};

/**
 * All app components generally expect to be inside a router and a redux store
 * provider. This module provides a HOC for that purpose
 */

export const Context = (props) => {
  const store = useRef(
    createStore(
      rootReducer,
      props.initialState,
      composeWithDevTools(applyMiddleware(thunk))
    )
  );

  return (
    <Provider store={store.current}>
      <MemoryRouter>{props.children}</MemoryRouter>
    </Provider>
  );
};

Context.propTypes = {
  children: PropTypes.node.isRequired,
  initialState: PropTypes.object,
};

Context.defaultProps = {
  initialState: {
    gallery: {
      gallery: {
        title: "title",
        description: "description",
        song_groups: [],
      },
    },
  },
};
