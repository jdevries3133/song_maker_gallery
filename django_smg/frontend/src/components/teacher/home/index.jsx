import React from "react";

import { Link, useRouteMatch } from "react-router-dom";

import styled, { Button } from "Styles";
import { Card } from "Common/card";

import StuSubmitImg from "Media/student_submit_md.jpg";
import { StudentSubmitDescription } from "./long_descriptions/student_submit";

import SpreadsheetImg from "Media/spreadsheet_md.jpg";
import { ManualDescription } from "./long_descriptions/manual";

import OverseeImg from "Media/monitor_students_md.jpg";
import { SocialDescription } from "./long_descriptions/social";

// TODO: this should not be doing so much snapping around. It should just
// freely fit the parent container so that it can play nice with multiple
// home page layouts.
const CardContainer = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-gap: 2em;
  margin-top: 5rem;
  background: #d5cbffeb;
  border: 1px solid black;
  border-radius: 20px;

  & > * {
    margin: 10px;
  }

  @media (min-width: 700px) {
    display: inline-flex;
    flex-wrap: wrap;
    flex-direction: row;
    padding: 1rem;
  }
`;

export const Home = () => {
  const { path } = useRouteMatch();
  return (
    <CardContainer>
      <Card
        title="Automatic Gallery"
        description="Let students post links."
        media={StuSubmitImg}
        actionButton={
          <Link to={`${path}/launch/auto`}>
            <Button>Start</Button>
          </Link>
        }
      >
        <StudentSubmitDescription />
      </Card>
      <Card
        title="Manual Gallery"
        description="Uploading spreadsheet data."
        media={SpreadsheetImg}
        actionButton={
          <Link to={`${path}/launch/manual`}>
            <Button>Start</Button>
          </Link>
        }
      >
        <ManualDescription />
      </Card>
    </CardContainer>
  );
};
