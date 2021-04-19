import React from "react";
import PropTypes from "prop-types";

import { H1 } from "Styles";

export const EditableRichTile = () => {
  return <H1>EditableRichTile</H1>;
};

EditableRichTile.propTypes = {
  title: PropTypes.string,
  link: PropTypes.string,
  description: PropTypes.string,
};
