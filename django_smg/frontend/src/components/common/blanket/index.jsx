import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { FocusLoop } from "Common/focus_loop";
import { Portal } from "Common/portal";
import styled, { Blanket as StyledBlanket, Button } from "Styles";

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

  // parent can override and force the blanket to come back or go away
  useEffect(() => {
    setEnabled(props.enabled);
  }, [props.enabled]);

  if (enabled) {
    return (
      <Portal>
        <FocusLoop>
          <StyledBlanket data-testid="blanket">
            <OkButton
              data-testid="dismissBlanketButton"
              onClick={() => {
                setEnabled(false);
                onDismissed && onDismissed();
              }}
            >
              Close
            </OkButton>
            <BlanketChildren>{children}</BlanketChildren>
          </StyledBlanket>
        </FocusLoop>
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
