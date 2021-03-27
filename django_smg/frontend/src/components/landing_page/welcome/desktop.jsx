import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { WelcomeText } from "./WelcomeText";
import styled, { H1 as DefaultH1 } from "../../common/styles";

import { Button } from "./mobile";

const H1 = styled(DefaultH1)`
  padding-bottom: 0;
  margin: 1rem;
  font-size: 5rem;
`;

const Table = styled.table`
  display: inline-block;
  position: center;
`;

const Spacer = styled.div`
  height: 2rem;
`;

const desktop = () => {
  return (
    <Fragment>
      <H1>Welcome to the Song Maker Gallery!</H1>
      <Table>
        <tbody>
          <tr>
            <td>
              <WelcomeText />
            </td>
            <td width="40" />
            <td>
              <a href="#gallery_top">
                <Button>View our sample gallery</Button>
              </a>
              <br />
              <Link to="/signup">
                <Button color="lightgreen">
                  Make a custom gallery for free
                </Button>
              </Link>
            </td>
          </tr>
        </tbody>
      </Table>
      <Spacer />
    </Fragment>
  );
};

export default desktop;
