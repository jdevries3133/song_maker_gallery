import React, { Component } from "react";

import { _DynamicTile } from "./dynamic_tile";
import { FallbackTile } from "./fallback_tile";

export { useSongRect } from "./useSongRect";

export class DynamicTile extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    console.error(error);
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <FallbackTile name={this.props.song.name} />;
    }
    return <_DynamicTile {...this.props} />;
  }
}
