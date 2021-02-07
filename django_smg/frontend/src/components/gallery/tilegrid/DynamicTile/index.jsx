import React, { Component } from "react";

import styled from "styled-components";

import { DynamicTileComponent } from "./dynamic_tile";
import { ErrorBoundary } from "./error_boundary";

const Div = styled.div`
  border: 2px solid red;
  bottom: 50px;
  display: inline-block;
  width: 300px;
  height: 103px;
  text-align: center;
  background: white;

  @media (min-width: 600px) {
    position: relative;
    bottom: 27px;
  }
`;

const P = styled.p`
  background: white;
  color: salmon;
  font-weight: bold;
  font-size: 18px;
`;

export class DynamicTile extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    console.log(error);
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      console.log(this.props);
      return (
        <Div>
          <P>Song Maker Link Invalid</P>
          <P>Composer Name: {this.props.song.name}</P>
        </Div>
      );
    }

    return (
      <ErrorBoundary>
        <DynamicTileComponent {...this.props} />
      </ErrorBoundary>
    );
  }
}
