import React from "react";
import PropTypes from "prop-types";

import { H2 } from "./styles";
import { Blanket } from "./blanket";

/**
 * Light abstraction on Blanket to render an array of error messages.
 */
export const ErrorArray = (props) => {
  return (
    <Blanket onDismissed={props.onOk}>
      <H2 data-testid="errorArray header">{props.header}</H2>
      {props.message.map((msg, i) => (
        <p data-testid="errorArray message" key={i + msg}>
          {msg}
        </p>
      ))}
    </Blanket>
  );
};

ErrorArray.propTypes = {
  header: PropTypes.string,
  message: PropTypes.array.isRequired,
  onOk: PropTypes.func,
};

ErrorArray.defaultProps = {
  header: "Error",
};
