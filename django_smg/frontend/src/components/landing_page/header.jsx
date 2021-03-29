import React from "react";
import { Link as DefaultLink } from "react-router-dom";

import styled, {
  css,
  A,
  P as DefaultP,
  Description,
  Div as DefaultDiv,
  H1 as DefaultH1,
  Button as DefaultButton,
} from "../common/styles";

const H1 = styled(DefaultH1)`
  padding-bottom: 0;
  margin: 1rem;
`;

const P = styled(DefaultP)`
  ${(props) =>
    props.focus &&
    css`
      font-weight bold;
      font-size: 20px;
      text-align: center;
    `}
`;

const Button = styled(DefaultButton)`
  display: block;
  height: 4 rem;
  width: 80%;
`;

const Link = styled(DefaultLink)`
  text-decoration: none;
`;

const Div = styled(DefaultDiv)`
  margin-bottom: 11rem;
`;

const Grid = styled.div`
  @media (min-width: 600px) {
    display: grid;
    grid-template-columns: 5% 30% 60% 5%;
    grid-template-rows: 20% 80%;
  }
`;

const GridItem = styled.div`
  @media (min-width: 600px) {
    grid-column-start: ${(props) => props.col || 1};
    grid-column-end: ${(props) => props.col || 1 + props.spanCol || 0};
    grid-row-start: ${(props) => props.row || 1};
  }
`;

export const LandingPageHeader = () => {
  return (
    <Div>
      <H1>Welcome to the Song Maker Gallery!</H1>
      <Grid>
        <GridItem col="2" row="1">
          <A href="#gallery_top">
            <Button>View our sample gallery</Button>
          </A>
        </GridItem>
        <GridItem col="2" row="2" spanCol="2">
          <Link to="/signup">
            <Button color="lightgreen">Make a custom gallery for free</Button>
          </Link>
        </GridItem>
        <GridItem col="3" row="1">
          <Description>
            <P justify>
              This website was created by me, a music teacher, in response to
              the simple need to find a way to feature our students' work in
              light of the COVID-19 pandemic. Our students' concerts have been
              cancelled, their rehearsals ceased, and their opportunities to
              share music diminished to a whisper of what they once were.
            </P>
            <P justify>
              As an upper elementary general music teacher, a big part of my
              COVID curriculum has been the{" "}
              <a href="https://musiclab.chromeexperiments.com/">
                Chrome Music Lab.
              </a>{" "}
              Students love making creations with it; it's fun and easy to use,
              and it provides an amazing platform for us to discuss the topics
              in our music curriculum. For me, the music lab has been an
              indispensable tool for coping with our school closure.
            </P>
            <P justify>
              <b>This website</b> is a simple way to share your students' work
              with your whole community. I know that I have been awestruck by
              the creativity of many of the music lab compositions that my
              students have shared with me, and I am sure that you feel the
              same.
            </P>
            <P focus style={{}}>
              We need a beautiful, simple, and easy way to share these
              compositions with as many people as possible!
            </P>
          </Description>
        </GridItem>
      </Grid>
    </Div>
  );
};
