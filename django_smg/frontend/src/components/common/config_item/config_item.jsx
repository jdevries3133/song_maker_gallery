import React from "react";
import PropTypes from "prop-types";

import { Switch } from "Common/switch";
import { Label } from "Styles";

/**
 * Snippet for displaying a nicely styled checkbox with a label
 */
export const ConfigItem = ({ id, label, checked, onChange, children }) => (
  <>
    <Label htmlFor={id ?? label}>{label}</Label>
    <label htmlFor={id ?? label}>{children}</label>
    <Switch id={id ?? label} checked={checked} onChange={onChange} />
  </>
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
};
