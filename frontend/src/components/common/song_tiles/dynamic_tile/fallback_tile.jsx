import React from "react";
import styled from "styled-components";

/**
 * TODO: this looks bad and should safely respond to size props.
 *
 * It should also not have the relative positioning hacks it has now. That
 * specifically makes it look ok in the context of the galleries so the
 * rows line up.
 */

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

export const FallbackTile = ({ name }) => (
  <Div>
    <P>Song Maker Link Invalid</P>
    <P>Composer Name: {name}</P>
  </Div>
);
