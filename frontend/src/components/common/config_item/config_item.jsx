import React from "react";
import PropTypes from "prop-types";

import { Switch as DefaultSwitch } from "Common/switch";
import styled, { Label } from "Styles";

// TODO: child styling gets weird if there is only one child; it should have
// rounded borders all around, but only gets the last-child rule for round
// borders on the bottom.
const Container = styled.div`
  display: grid;
  grid-template-rows: repeat(2, auto);
  grid-template-columns: 10fr 1fr 1fr;
  max-width: 50rem;
  padding: 3vw;

  &:first-child {
    border-radius: 20px 20px 0 0;
  }

  &:last-child {
    border-radius: 0 0 20px 20px;
  }

  &:nth-child(odd) {
    background-color: hsla(111, 100%, 95%, 1);
  }

  &:nth-child(even) {
    background-color: hsla(321, 100%, 95%, 1);
  }
`;

const MainLabel = styled(Label)`
  grid-row: 1;
`;

const ChildLabel = styled.label`
  grid-row: 2;
`;

const Switch = styled(DefaultSwitch)`
  /* switch's relative position push it down; this pushes it back up */
  margin-bottom: 35px;

  align-self: center;
  grid-row-start: 1;
  grid-row-end: 3;
  grid-column: 3;
`;

/**
 * Snippet for displaying a nicely styled checkbox with a label. You need
 * to wrap these in their own div for the :nth-child styling to look right.
 */
export const ConfigItem = ({
  id,
  label,
  checked,
  onChange,
  children,
  className,
}) => (
  <Container className={className}>
    <MainLabel htmlFor={id ?? label}>{label}</MainLabel>
    <ChildLabel htmlFor={id ?? label}>{children}</ChildLabel>
    <Switch id={id ?? label} checked={checked} onChange={onChange} />
  </Container>
);

ConfigItem.propTypes = {
  /**
   * For <label> and <input> elements. Label text is used as id if not
   * provided
   */
  id: PropTypes.string,

  /* text that will appear in large, primary styled label */
  label: PropTypes.string.isRequired,

  /* checkbox state handlers */
  checked: PropTypes.bool,
  onChange: PropTypes.func,

  /**
   * add'l info passed as children will be displayed in an add'l unstyled
   * <label> element
   */
  children: PropTypes.node,

  /**
   * styles outer container; will be passed when consumer styles with
   * styled-components
   */
  className: PropTypes.string,
};
