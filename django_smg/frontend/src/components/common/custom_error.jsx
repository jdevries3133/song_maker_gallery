/**
 * TODO: depricate this module.
 * Do not use this, use the useModals hook instead, and replace the
 * use of this module with useModals whenever possible.
 */
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { Blanket, Button, H2 } from "./styles";

export const StyledCustomError = styled(Blanket)`
  & > div {
    width: 70%;
    margin: auto;
  }
`;

/**
 * Generic error modal that renders props.children in the modal window
 */
export const CustomError = ({ children, onOk }) => {
  return (
    <StyledCustomError>
      <div data-testid="CustomError">
        {children}
        <Button data-testid="onOkButton" color="#4caf50" onClick={onOk}>
          Ok
        </Button>
      </div>
    </StyledCustomError>
  );
};

CustomError.propTypes = {
  children: PropTypes.node.isRequired,
  onOk: PropTypes.func.isRequired,
};
/**
 * Render an array of error messages
 */
export const ErrorArray = (props) => {
  return (
    <CustomError onOk={() => props.onOk()}>
      <H2 data-testid="errorArray header">{props.header}</H2>
      {props.message.map((par, i) => (
        <p data-testid="errorArray message" key={i}>
          {par}
        </p>
      ))}
    </CustomError>
  );
};

ErrorArray.propTypes = {
  header: PropTypes.string,
  message: PropTypes.array.isRequired,
  onOk: PropTypes.func.isRequired,
};

ErrorArray.defaultProps = {
  header: "Error",
};
