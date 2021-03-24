import React from "react";
import useWidth from "../../generics/useWidth";
import Desktop from "./desktop";
import Mobile from "./mobile";
import styled, { Div as DefaultDiv } from "../../generics/styles";

const Div = styled(DefaultDiv)`
  margin-bottom: 11rem;
`;

const welcome = () => {
  const { width } = useWidth(475);
  return <Div>{width > 475 ? <Desktop /> : <Mobile />}</Div>;
};

export default welcome;
