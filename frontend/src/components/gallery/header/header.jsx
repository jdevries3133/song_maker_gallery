import React from "react";

import styled, {
  H1,
  P,
  Button,
  Description as DefaultDescription,
} from "Styles";
import FormattedDescription from "./formatted_description";
import NavBar from "./navBar";
import useWidth from "Common/useWidth";

const Description = styled(DefaultDescription)`
  display: inline-block;
  max-width: 850px;
`;

const Header = styled.header`
  width: 100%;
  text-align: center;
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
    <Header id="gallery_top">
      {width > 1000 ? <NavBar data={props.data} /> : null}
      <H1>{props.title}</H1>
      <Description>
        <FormattedDescription desc_str={props.description} />
        {width > 475 ? (
          <P>
            <b>
              Hover over the picture of a students' work to see their name, and
              click to open their composition in a new tab
            </b>
          </P>
        ) : (
          <P>
            <b>
              Scroll down to view the gallery! Each tile shows a student's
              composition, and that student's name will be displayed when their
              tile reaches the top of your phone screen!
            </b>
          </P>
        )}
        <a href="#gallery">
          <CallToAction>View Gallery</CallToAction>
        </a>
      </Description>
      {width < 1000 ? <NavBar data={props.data} /> : null}
    </Header>
  );
};

export default header;
