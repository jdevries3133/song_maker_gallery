/**
 * terms of service
 */

import React, { useState, Fragment } from "react";
import styled from "styled-components";

import { TosText } from "./terms_of_service";
import { PrivacyText } from "./privacy_policy";

export { TosPage } from "./terms_of_service";
export { PrivacyPage } from "./privacy_policy";

/* Force <a> styling on anchor tags without href */
const A = styled.a`
  color: blue;
  font-weight: bold;
  text-decoration: underline;

  &:hover {
    cursor: pointer;
  }
`;

export const Tos = () => {
  const [blanket, setBlanket] = useState(null);
  return (
    <Fragment>
      {blanket}
      <A onClick={() => setBlanket(<TosText onOk={() => setBlanket(null)} />)}>
        Terms of Service
      </A>
    </Fragment>
  );
};

export const Privacy = () => {
  const [blanket, setBlanket] = useState(null);
  return (
    <Fragment>
      {blanket}
      <A
        onClick={() =>
          setBlanket(<PrivacyText onOk={() => setBlanket(null)} />)
        }
      >
        Privacy Policy
      </A>
    </Fragment>
  );
};
