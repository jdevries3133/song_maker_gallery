import React from "react";
import styled from "styled-components";

import { Div } from "../common/styles";
import useWidth from "../common/useWidth";
import { Tos, Privacy } from "../legal";

const FooterElem = styled.footer`
  margin: 3rem;
  > div {
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
