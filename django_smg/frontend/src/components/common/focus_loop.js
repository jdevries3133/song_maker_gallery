import React, { useEffect, useRef } from "react";
import styled from "Styles";
const GhostButton = styled.button`
  /* remove to see ghost buttons which are placed when modal is mounted */
  visibility: hidden;
`;

export const FocusLoop = ({ children }) => {
  const first = useRef(null);
  const last = useRef(null);

  useEffect(() => {
    first.current.focus();

    document.addEventListener("keydown", handleTabPress);

    return () => {
      document.removeEventListener("keydown", handleTabPress);
    };
  }, []);

  const handleTabPress = (e) => {
    let isTabPressed = e.key === "Tab";

    if (!isTabPressed) {
      return;
    }
    if (e.shiftKey) {
      if (document.activeElement === first.current) {
        last.current.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === last.current) {
        first.current.focus();
        e.preventDefault();
      }
    }
  };

  return (
    <div>
      <GhostButton ref={first} />
      {children}
      <GhostButton ref={last} />
    </div>
  );
};
