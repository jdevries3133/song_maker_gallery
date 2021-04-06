import React from "react";

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
  display: inline-block;
  margin-top: 5rem;
  background: #d5cbffeb;
  border: 1px solid black;
  border-radius: 20px;

  & > * {
    margin: 10px;
  }

  @media (min-width: 800px) {
    display: inline-flex;
    flex-wrap: wrap;
    flex-direction: row;
    width: 90%;
    margin: 5rem 5vw 5vw 5vw;
    padding: 5vw;

    & > * {
      width: 30%;
    }
  }
`;

export const Home = () => (
  <CardContainer>
    <Card
      title="Automatic Gallery"
      description="Let students post links."
      media={StuSubmitImg}
      actionButton={<Button>Placeholder</Button>}
    >
      <StudentSubmitDescription />
    </Card>
    <Card
      title="Manual Gallery"
      description="Uploading spreadsheet data."
      media={SpreadsheetImg}
      actionButton={<Button>Placeholder</Button>}
    >
      <ManualDescription />
    </Card>
    <Card
      title="Social Galleries"
      description="Responding: It's in the curriculum!"
      media={OverseeImg}
      actionButton={<Button>Placeholder</Button>}
    >
      <SocialDescription />
    </Card>
  </CardContainer>
);
