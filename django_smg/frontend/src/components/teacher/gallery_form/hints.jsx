import React from "react";
import styled, {
  Description as DefaultDescription,
  H1 as DefaultH1,
  P,
  css,
} from "Styles";

const Description = styled(DefaultDescription)`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: skyblue;
  ${(props) =>
    props.warn &&
    css`
      background-color: #e41000;
    `}
`;

const H1 = styled(DefaultH1)`
  margin: 0;
  padding: 0;
  font-size: 3rem;
`;

export const SwapHint = () => (
  <Description data-testid="swap target">
    <H1>Swap Us</H1>
  </Description>
);

export const BadDragHint = () => (
  <Description warn>
    <H1>Cannot Drag!</H1>
    <P>You cannot drag a student from one group to another</P>
  </Description>
);
