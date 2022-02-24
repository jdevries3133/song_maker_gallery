import React, { useState } from "react";

import LoadingSpinner from "Common/loading";
import styled, { Button as DefaultButton } from "Styles";

const SpinContainer = styled.div`
  justify-self: center;
  align-self: center;
  grid-column: 2;
`;

const Form = styled.form`
  justify-self: center;
  grid-column-start: 1;
  grid-column-end: 4;
  padding: 10px;
`;

const Label = styled.label`
  display: inline;
  padding-right: 1.5rem;
`;

const Button = styled(DefaultButton)`
  display: inline;
  background-color: #87f40b;
`;

// TODO: this will need to be connected to a redux action to approve comments
export const ApproveCommentForm = () => {
  const [clicked, setClicked] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    console.log("comment approved");
    setClicked(true);
  };

  return clicked ? (
    <SpinContainer>
      <LoadingSpinner />
    </SpinContainer>
  ) : (
    <Form onSubmit={submit}>
      <Label htmlFor="approve">Approve Comment?</Label>
      <Button id="approve" as="input" type="submit" value="Approve" />
    </Form>
  );
};
