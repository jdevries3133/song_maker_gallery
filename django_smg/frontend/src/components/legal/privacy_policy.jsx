import React from "react";
import { Link } from "react-router-dom";

import { Blanket, Button, Description } from "../generics/styles";
import { LegalContainer } from "./terms_of_service";

const PrivacyContent = (props) => (
  <LegalContainer>
    <h1 id="privacy-policy">Privacy Policy</h1>
    <p>
      This Agreement shall be governed by the laws of the State of New Jersey
    </p>
    <p>
      Also see our <Link to="/tos/">Terms of Service</Link>
    </p>
    <ol>
      <li>
        Do not upload any personallly identifying information (as defined in the
        Children's Online Privacy Protection Rule ("COPPA")) of any individual
        under thirteen years of age.
      </li>
      <li>
        Do not upload the personally identifying information of any individual
        under eighteen years of age without authorization to do so from that
        individual's parent or guardian.
      </li>
    </ol>
    {props.okButton ? props.okButton : null}
  </LegalContainer>
);

export const PrivacyPage = () => (
  <Description>
    <PrivacyContent />
  </Description>
);

export const PrivacyText = (props) => (
  <Blanket>
    <PrivacyContent
      okButton={<Button onClick={() => props.onOk()}>Close</Button>}
    />
  </Blanket>
);
