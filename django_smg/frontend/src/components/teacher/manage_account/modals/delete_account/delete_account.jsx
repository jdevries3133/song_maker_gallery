import React, { useState } from "react";
import PropTypes from "prop-types";
import styled, {
  H2,
  H3 as DefaultH3,
  P as DefaultP,
  Button as DefaultButton,
  Input,
  Label,
  Form as DefaultForm,
} from "Styles";

import { Attestation } from "./attestation";

const Form = styled(DefaultForm)`
  padding: 3vw;
`;

const Button = styled(DefaultButton)`
  background-color: #c22014;
  color: white;
  max-width: 100px;

  &:hover {
    color: black;
  }
`;

const HWarn = styled(DefaultH3)`
  color: white;
`;

const P = styled(DefaultP)`
  color: white;
  margin: 0;
  padding: 0;
`;

const Warning = styled.div`
  padding: 4vw;
  background-color: #bf1300;
  border-radius: 20px;
`;

export const DeleteAccount = ({ userId, deleteAccount }) => {
  // TODO: follow-up view to confirm action or report error
  const [showAttestWarning, setShowAttestWarning] = useState(false);
  const [attestation, setAttestation] = useState("");
  const [passwd, setPasswd] = useState("");

  const handlePasswdInput = (e) => setPasswd(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (attestation) {
      deleteAccount(userId, passwd);
    } else {
      setShowAttestWarning(true);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <H2>Delete Your Account</H2>
      <Warning>
        <HWarn>Warning!</HWarn>
        <P warn justify>
          If you delete your account, all galleries,{" "}
          <b>including all social gallery engagement data</b> will be deleted{" "}
          <b>
            <i>PERMANENTLY</i>
          </b>
        </P>
      </Warning>
      <Attestation
        submitAttempted={showAttestWarning}
        attestation={attestation}
        setAttestation={setAttestation}
      />
      <Label htmlFor="password">Your Password</Label>
      <Input
        data-testid="password"
        id="password"
        type="password"
        onChange={handlePasswdInput}
        autocomplete="current-password"
      />
      <Button
        color="red"
        data-testid="submit"
        as="input"
        type="submit"
        value="Submit"
      />
    </Form>
  );
};

DeleteAccount.propTypes = {
  /* function(newEmail, userId, token) to change email */
  deleteAccount: PropTypes.func,

  /* current user credentials */
  userId: PropTypes.number,
};
