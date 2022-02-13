import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { FocusLoop } from "Common/focus_loop";
import { Portal } from "Common/portal";
import styled, { Button } from "Styles";

import { StyledBlanket } from "./styled_blanket";

const BlanketChildren = styled.div`
  margin-top: 2rem;
`;

const OkButton = styled(Button)`
  position: absolute;
  top: 0;
  left: 0;
  margin: 0;
  border-radius: 0 0 20px 0;
  background-color: salmon;
`;

export const Blanket = ({ children, onDismissed, ...props }) => {
  // manage whether the component is displayed
  const [enabled, setEnabled] = useState(true);
  const disable = (e) => {
    if (e.type == "keydown" && e.key !== "Escape") return;
    e.preventDefault();
    setEnabled(false);
    onDismissed && onDismissed();
  };

  // parent can override and force the blanket to come back or go away
  useEffect(() => {
    setEnabled(props.enabled);
  }, [props.enabled]);

  // modal can be closed with Escape key
  useEffect(() => {
    document.addEventListener("keydown", disable);
    return () => document.removeEventListener("keydown", disable);
  });

  if (enabled) {
    return (
      <Portal>
        <StyledBlanket data-testid="blanket">
          <FocusLoop>
            <OkButton data-testid="dismissBlanketButton" onClick={disable}>
              Close
            </OkButton>
            <BlanketChildren>{children}</BlanketChildren>
          </FocusLoop>
        </StyledBlanket>
      </Portal>
    );
  }
  return null;
};

Blanket.propTypes = {
  children: PropTypes.node,
  dimissedCallback: PropTypes.func,
  enabled: PropTypes.bool,
};

Blanket.defaultProps = {
  enabled: true,
};
