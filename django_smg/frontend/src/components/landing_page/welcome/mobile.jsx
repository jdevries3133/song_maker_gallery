import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { WelcomeText } from "./WelcomeText";
import styled, {
  H1 as DefaultH1,
  Button as DefaultButton,
} from "../../generics/styles";

export const Button = styled(DefaultButton)`
  height: 4 rem;
  width: 80%;
`;

const H1 = styled(DefaultH1)`
  padding-bottom: 0;
  margin: 1rem;
  font-size: 5rem;
`;

const mobile = () => {
  return (
    <Fragment>
      <H1>Welcome to the Song Maker Gallery!</H1>
      <a href="#gallery_top">
        <Button>View our sample gallery</Button>
      </a>
      <br />
      <Link to="/signup">
        <Button color="lightgreen">Make a custom gallery for free</Button>
      </Link>
      <WelcomeText />
    </Fragment>
  );
};

export default mobile;
