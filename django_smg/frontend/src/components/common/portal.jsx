import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

/* Hack because global css doesn't work in storybook... */
const GlobalStyles = styled.div`
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }

  background: url("/static/frontend/background.png");
  background-size: 50vw;
  font-family: "Merriweather Sans", -apple-system, BlinkMacSystemFont,
    "Segoe UI", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
    "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  @media (min-width: 475px) {
    scroll-behavior: smooth;
  }
`;

/* Necessary because this div should cover the whole screen */
const FixedWrapper = styled(GlobalStyles)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vh;
  height: 100vh;
`;

/* Makes an element that jest / react-testing library can test against */
const getElement = () => {
  const el = document.createElement("div");
  el.setAttribute("data-testid", "portalContainer");
  el.id = "portalContainer";
  return el;
};

/**
 * Very simple portal that mounts children in a separate node from the rest
 * of the app, and destroys that dom node on dismount.
 */
export const Portal = ({ children }) => {
  const [modalEl, setModalEl] = useState(null);
  useEffect(() => {
    const el = getElement();
    document.body.appendChild(el);
    setModalEl(el);
    return () => {
      document.body.removeChild(document.getElementById("portalContainer"));
    };
  }, []);
  return modalEl
    ? ReactDOM.createPortal(<FixedWrapper>{children}</FixedWrapper>, modalEl)
    : null;
};
