import React from "react";
import PropTypes from "prop-types";

import styled, { Div, H4 } from "Styles";

import { ASPECT_RATIO } from "./constants";
import { Layout } from "./dynamic_tile_layout";

/**
 * Do not use this component directly! It is unsafe and may throw errors.
 * Instead, use the HOC in index.jsx, which includes error handling and a
 * fallback UI.
 */
export const _DynamicTile = (props) => {
  const tileSize = {
    width: props.pixelWidth,
    height: Math.floor(props.pixelWidth / ASPECT_RATIO),
  };
  console.log(tileSize);

  return <Layout mobile={props.mobile} song={props.song} tileSize={tileSize} />;
};

_DynamicTile.propTypes = {
  song: PropTypes.object.isRequired,
  pixelWidth: PropTypes.number,
};

_DynamicTile.defaultProps = {
  pixelWidth: 600,
};
