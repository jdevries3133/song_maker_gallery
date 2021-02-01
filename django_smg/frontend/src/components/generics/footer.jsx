import React from "react";
import styled from "styled-components";
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

export const Footer = (props) => (
  <FooterElem>
    <div style={{ display: "inline-block" }}>
      <Tos displayText="terms of service" />
      <span>|</span>
      <Privacy displayText="privacy policy" />
    </div>
  </FooterElem>
);
