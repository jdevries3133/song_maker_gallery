import React from "react";
import styled, { H2, P, Button } from "Styles";

const DeleteBtn = styled(Button)`
  background-color: maroon;
  color: white;
`;

export const ConfirmDelete = (props) => {
  return (
    <>
      <H2>Are you sure?</H2>
      <P>
        This gallery will be permanently deleted and no longer available at the
        url:
      </P>
      <P center>
        <a data-testid="lastChanceLink" href={props.url}>
          {props.url}
        </a>
      </P>
      <DeleteBtn
        data-testid="confirmDeleteBtn"
        onClick={() => props.confirmation(props.pk)}
      >
        I am sure
      </DeleteBtn>
    </>
  );
};

export const GalleryDeleted = () => (
  <>
    <H2>Success</H2>
    <P>Your gallery has been deleted.</P>
  </>
);

export const ServerError = () => (
  <>
    <H2>Oops!</H2>
    <P justify>Our server must be in a bad mood today; please try again!</P>
  </>
);
