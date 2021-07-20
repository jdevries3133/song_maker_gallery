import React from "react";
import PropTypes from "prop-types";

import styled, { Label } from "Styles";

const StyledSelect = styled.select`
  font-size: 1.2rem;
`;

/**
 * To pass additional information, children are placed between the label
 * and the dropdown selector
 */
export const Select = ({ id, label, choices, children, value, onChange }) => (
  <>
    <Label htmlFor={id}>{label}</Label>
    {children && <label htmlFor={id}>{children}</label>}
    <StyledSelect value={value} onChange={onChange} id={id}>
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
