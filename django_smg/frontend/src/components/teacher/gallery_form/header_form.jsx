import React from "react";
import styled, { P, Description as D, Label, Input, Textarea } from "Styles";

const Description = styled(D)`
  max-width: 500px;
`;

const Div = styled.div`
  display: flex;
  justify-content: center;
`;

export const HeaderForm = ({ title, description }) => (
  <Div>
    <Description as="form">
      <P justify>
        Information for the whole gallery. This will appear at the top of the
        page, and the title will be reflected in the gallery's URL.
      </P>
      <Label htmlFor="gallery title">Title</Label>
      <Input id="gallery title" initialValue={title} />
      <Label htmlFor="gallery description">Description</Label>
      <Textarea id="gallery description" initialValue={description} />
    </Description>
  </Div>
);
