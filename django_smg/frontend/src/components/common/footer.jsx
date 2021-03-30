import React from "react";
import styled from "styled-components";

import { Div } from "Styles";
import useWidth from "Common/useWidth";
import { Tos, Privacy } from "../legal";

const FooterElem = styled.footer`
  text-align: center;
  margin: 3rem;

  > div {
    display: inline-block;
    background-color: white;
    padding: 5px;
    border-radius: 3px;
  }

  > * > a {
    font-size: 18px;
  }
`;

export const Footer = () => {
  const { width } = useWidth(415);
  return (
    <FooterElem>
      <Div>
        <Tos displayText="terms of service" />
        {width > 415 ? <span>|</span> : <br />}
        <Privacy displayText="privacy policy" />
      </Div>
    </FooterElem>
  );
};
