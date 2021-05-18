import React from "react";
import { Link, useRouteMatch } from "react-router-dom";

import styled, { Button } from "Styles";

const Tools = styled.header`
  position: fixed;
  z-index: 10;
  top: 0;
  right: 0;

  & > button {
    margin: 0 10px;
  }
`;

export const Nav = ({ slug }) => {
  const { url } = useRouteMatch();
  const urlParts = url
    .split("/")
    .filter((p) => p !== "")
    .slice(0, -1);
  const newUrl = "/" + urlParts.join("/") + "/demo/";
  return (
    <Tools>
      <Link to={newUrl}>
        <Button>Demo Gallery</Button>
      </Link>
    </Tools>
  );
};
