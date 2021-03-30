import React from "react";

import styled, { Div as DefaultDiv } from "../common/styles";

import Header from "./header";
import AddGallery from "./add_gallery";
import ListGalleries from "./list_galleries";

const Div = styled(DefaultDiv)`
  & > div {
    margin-bottom: 2rem;
  }
`;

const Teacher = ({ token, logout }) => {
  return (
    <Div>
      <Header />
      <AddGallery />
      <ListGalleries />
    </Div>
  );
};

export default Teacher;
