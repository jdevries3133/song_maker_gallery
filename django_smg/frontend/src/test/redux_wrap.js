import React from "react";
import { render as rtlRender } from "@testing-library/react";

import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { Provider } from "react-redux";
import thunk from "redux-thunk";

import reducer from "../reducers";

/**
 * Wraps react-testing-library render function to provide the redux store.
 */
function render(ui, initialState, renderOptions) {
  const store = createStore(
    reducer,
    initialState || {
      gallery: {
        gallery: {
          title: "title",
          description: "description",
          songData: [],
        },
      },
    },
    composeWithDevTools(applyMiddleware(thunk))
  );
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// re-export everything
export * from "@testing-library/react";
// override render method
export { render };
