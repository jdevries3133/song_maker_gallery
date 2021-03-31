import React from "react";

import styled, { Div as DefaultDiv } from "Styles";
import { Card } from "Common/card";

import StuSubmitImg from "Media/student_submit_md.jpg";
import { StudentSubmitDescription } from "./long_descriptions/student_submit";

import SpreadsheetImg from "Media/spreadsheet_md.jpg";
import { ManualDescription } from "./long_descriptions/manual";

import OverseeImg from "Media/monitor_students_md.jpg";
import { SocialDescription } from "./long_descriptions/social";

const Div = styled(DefaultDiv)`
  text-align: center;
  margin: 5vw;
  margin-top: 5rem;
  background: #d5cbffeb;
  border: 1px solid black;
  border-radius: 20px;
  padding: 5vw;

  & > * {
    height: 30%;
    width: 100%;
  }

  @media (min-width: 1000px) {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    & > * {
      margin: 0.5rem;
      width: calc(30% - 1rem);
    }
  }
`;

export const Home = () => (
  <Div>
    <Card
      title="Automatic Gallery"
      description="Let students post links."
      media={StuSubmitImg}
    >
      <StudentSubmitDescription />
    </Card>
    <Card
      title="Manual Gallery"
      description="Uploading spreadsheet data."
      media={SpreadsheetImg}
    >
      <ManualDescription />
    </Card>
    <Card
      title="Social Galleries"
      description="Responding: It's in the curriculum!"
      media={OverseeImg}
    >
      <SocialDescription />
    </Card>
  </Div>
);
