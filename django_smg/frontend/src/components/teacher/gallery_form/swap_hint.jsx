import React from "react";
import styled, { Description as DefaultDescription, H1 } from "Styles";

const Description = styled(DefaultDescription)`
  /*
  display: flex;
  align-items: center;
  justify-content: center;
  */
  background-color: skyblue;
`;

export const SwapHint = () => (
  <Description>
    <H1>Swap Us</H1>
  </Description>
);
