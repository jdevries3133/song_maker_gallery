import React from "react";
import PropTypes from "prop-types";

import styled, { Button } from "Styles";

const OkButton = styled(Button)`
  position: absolute;
  top: 1px;
  left: 1px;
  margin: 0;
  border-radius: 0 0 20px 0;
  background-color: salmon;
`;

export const Blanket = (props) => {
  return (
    <Blanket>
      <OkButton>Close</OkButton>
      {props.children}
    </Blanket>
  );
};

Blanket.propTypes = {
  children: PropTypes.node.isRequired,
};
