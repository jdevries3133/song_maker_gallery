import React from "react";

import { Card } from "./card";
import styled, { Button } from "Styles";

export default {
  title: "Card",
  component: Card,
};

const Template = (args) => <Card {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: "Custom Gallery",
  description: "Make your students' compositions shine",
  media: "monitor_students_md.jpg",
  actionButton: <Button>Action Now!</Button>,
};

/**
 * Styles and markup for layout of multiple cards.
 */

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 300px;
  grid-gap: 1rem;

  @media(max-width: 700px) {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(3, 1fr);
`;

const MultipleLayout = (args) => (
  <CardGrid>
    <Card
      title={args.card1Title}
      description={args.card1Description}
      media="monitor_students_md.jpg"
      actionButton={<Button>{args.buttonText}</Button>}
    />
    <Card
      title={args.card2Title}
      description={args.card2Description}
      media="student_submit_md.jpg"
      actionButton={<Button>{args.buttonText}</Button>}
    />
    <Card
      title={args.card3Title}
      description={args.card3Description}
      media="spreadsheet_md.jpg"
      actionButton={<Button>{args.buttonText}</Button>}
    />
  </CardGrid>
);

export const Multiple = MultipleLayout.bind({});
Multiple.args = {
  buttonText: "Do It!",
  card1Title: "First Thing",
  card1Description: "You should give the first thing a shot!",
  card2Title: "Second Thing",
  card2Description: "This is also a nice thing to try.",
  card3Title: "Or, do Excel!",
  card3Description: "Do you have a burning passion for spreadsheets?",
};
