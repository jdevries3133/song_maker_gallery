import React from "react";
import styled from "styled-components";

import { Button } from "../../generics/styles";
import FormattedDescription from "./formatted_description";
import NavBar from "./navBar";
import useWidth from "../../generics/useWidth";

const Header = styled.header`
  margin-bottom: 10rem;

  @media (max-width: 475px) {
    margin-bottom: auto;
  }
`;

const CallToAction = styled(Button)`
  font-size: 1.5rem;
  padding: 28px;
`;

const header = (props) => {
  const { width } = useWidth(1000);
  return (
    <Header>
      {width > 1000 ? <NavBar data={props.data} /> : null}
      <h1>{props.title}</h1>
      <div className="description">
        <FormattedDescription desc_str={props.description} />
        {width > 475 ? (
          <p>
            <b>
              Hover over the picture of a students' work to see their name, and
              click to open their composition in a new tab
            </b>
          </p>
        ) : (
          <p>
            <b>
              Scroll down to view the gallery! Each tile shows a student's
              composition, and that student's name will be displayed when their
              tile reaches the top of your phone screen!
            </b>
          </p>
        )}
        <a href="#gallery">
          <CallToAction>View Gallery</CallToAction>
        </a>
      </div>
      {width < 1000 ? <NavBar data={props.data} /> : null}
    </Header>
  );
};

export default header;
