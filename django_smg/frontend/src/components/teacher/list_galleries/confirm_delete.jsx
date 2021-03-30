import React from "react";
import styled, { H2, P, Blanket, Button } from "Styles";

const DeleteBtn = styled(Button)`
  background-color: maroon;
  color: white;
`;

export const ConfirmDelete = (props) => {
  return (
    <Blanket>
      <H2>Are you Sure?</H2>

      <P>
        This gallery will be permanently deleted and no longer available at the
        url:
      </P>
      <P center>
        <a href={props.url}>{props.url}</a>
      </P>
      <DeleteBtn onClick={() => props.confirmation(props.pk)}>
        I am sure
      </DeleteBtn>
    </Blanket>
  );
};
