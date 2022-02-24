import React from "react";
import PropTypes from "prop-types";

import { Blanket } from "Common/blanket";
import { H2 } from "./styles";

/**
 * Render an array of error messages
 */
export const ErrorArray = (props) => {
  return (
    <Blanket onDismissed={props.onOk}>
      <H2 data-testid="errorArray header">{props.header}</H2>
      {props.message.map((par, i) => (
        <p data-testid="errorArray message" key={i}>
          {par}
        </p>
      ))}
    </Blanket>
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
