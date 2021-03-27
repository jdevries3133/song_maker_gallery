import { useState, useEffect } from "react";
import ReactDOM from "react-dom";

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
  return modalEl ? ReactDOM.createPortal(children, modalEl) : null;
};
