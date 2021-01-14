/**
 * terms of service
 */

import React, { useState, Fragment } from "react";

import { TosText } from "./terms_of_service";
import { PrivacyText } from "./privacy_policy";

export { TosPage } from "./terms_of_service";
export { PrivacyPage } from "./privacy_policy";

export const Tos = () => {
  const [blanket, setBlanket] = useState(null);
  return (
    <Fragment>
      {blanket}
      <a onClick={() => setBlanket(<TosText onOk={() => setBlanket(null)} />)}>
        Terms of Service
      </a>
    </Fragment>
  );
};

export const Privacy = (props) => {
  const [blanket, setBlanket] = useState(null);
  return (
    <Fragment>
      {blanket}
      <a
        onClick={() =>
          setBlanket(<PrivacyText onOk={() => setBlanket(null)} />)
        }
      >
        Privacy Policy
      </a>
    </Fragment>
  );
};
