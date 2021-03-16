/**
 * All app components generally expect to be inside a router and a redux store
 * provider. This module provides a HOC for that purpose
 */

import React, { useRef } from "react";
import PropTypes from "prop-types";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";

import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "../reducers";

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
        songData: [],
      },
    },
  },
};
