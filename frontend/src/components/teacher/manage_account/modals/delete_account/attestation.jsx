import React from "react";
import styled, { Label, Textarea, P } from "Styles";

export const ATTESTATION = "Delete account, all galleries, and all other data";

const StyledAttest = styled.code`
  font-weight: bold;
`;

export const Attestation = ({
  attestation,
  setAttestation,
  submitAttempted,
}) => {
  const inputHandler = (e) => {
    if (attestation) {
      if (e.target.value.includes(ATTESTATION)) {
        setAttestation(false);
      }
    } else {
      if (e.target.value.includes(ATTESTATION)) {
        setAttestation(true);
      }
    }
  };

  return (
    <>
      <Label htmlFor="attestation">
        Please copy this statement to confirm:
      </Label>
      <StyledAttest>{ATTESTATION}.</StyledAttest>

      {submitAttempted && (
        <P warn>
          You must type the statement above in the space below to proceed.
        </P>
      )}

      <Textarea
        data-testid="attestation"
        id="attestation"
        onChange={inputHandler}
      />
    </>
  );
};
