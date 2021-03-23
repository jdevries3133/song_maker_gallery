import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { Blanket } from "./styles";

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
      <div>
        {children}
        <button
          data-testid="onOkButton"
          style={{ backgroundColor: "#4caf50" }}
          onClick={onOk}
        >
          Ok
        </button>
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
      <h2 data-testid="customError header">{props.header}</h2>
      {props.message.map((par, i) => (
        <p key={i}>{par}</p>
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
