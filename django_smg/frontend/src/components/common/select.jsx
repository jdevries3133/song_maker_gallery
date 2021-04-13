import React from "react";
import PropTypes from "prop-types";

import { Label as StyledLabel, Select as StyledSelect } from "Styles";

/**
 * To pass additional information, children are placed between the label
 * and the dropdown selector
 */
export const Select = ({ id, label, choices, children }) => (
  <>
    <StyledLabel htmlFor={id}>{label}</StyledLabel>
    <label htmlFor={id}>{children}</label>
    <StyledSelect id={id}>
      {choices.map((choice) => (
        <option key={choice} value={choice}>
          {choice}
        </option>
      ))}
    </StyledSelect>
  </>
);

Select.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  choices: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.node,
};
