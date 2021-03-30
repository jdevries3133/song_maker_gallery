import React from "react";

import styled, { Div as DefaultDiv } from "Styles";
import { Card } from "Common/card";

import SpreadsheetImg from "./media/spreadsheet_md.jpg";
import StuSubmitImg from "./media/student_submit_md.jpg";
import OverseeImg from "./media/monitor_students_md.jpg";

const Div = styled(DefaultDiv)`
  margin-top: 5rem;
  background: #d5cbffeb;
  border: 1px solid black;
  border-radius: 20px;
  padding: 5vw;
`;

export const Home = () => (
  <Div>
    <Card
      title="Manual Gallery"
      description="Uploading spreadsheet data."
      media={SpreadsheetImg}
    />
    <Card
      title="Student-Submit Gallery"
      description="Let students post links."
      media={StuSubmitImg}
    />
    <Card
      title="Social Galleries"
      description="Responding: It's in the curriculum!"
      media={OverseeImg}
    />
  </Div>
);
