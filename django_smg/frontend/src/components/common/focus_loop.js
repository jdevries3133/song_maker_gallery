import React, { useEffect, useRef } from "react";
import styled from "Styles";

const GhostButton = styled.button`
  width: 0;
  height: 0;
  opacity: 0;
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
    const isTabPressed = e.key === "Tab";
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
