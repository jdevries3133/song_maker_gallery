import React, { Component } from "react";

import { DynamicTileComponent } from "./dynamic_tile";
import { FallbackTile } from "./fallback_tile";

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
    return <DynamicTileComponent {...this.props} />;
  }
}
