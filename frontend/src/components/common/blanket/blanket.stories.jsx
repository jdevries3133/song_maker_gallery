import React from "react";
import { H2, H3, P } from "Styles";
import { Blanket } from "./index";

export default {
  title: "Common/Blanket",
  component: Blanket,
};

const Template = (args) => <Blanket {...args}></Blanket>;

/* placeholder content */
const Content1 = () => (
  <>
    <H2>Something Happened</H2>
    <P justify>
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem
      accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab
      illo inventore veritatis et quasi architecto beatae vitae dicta sunt
      explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
      odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
      voluptatem sequi nesciunt.
    </P>
    <P justify>
      Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,
      consectetur, adipisci velit, sed quia non numquam eius modi tempora
      incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad
      minima veniam, quis nostrum exercitationem ullam corporis suscipit
      laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum
      iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae
      consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla
      pariatur?"
    </P>
    <P justify>
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem
      accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab
      illo inventore veritatis et quasi architecto beatae vitae dicta sunt
      explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
      odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
      voluptatem sequi nesciunt.
    </P>
    <P justify>
      Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,
      consectetur, adipisci velit, sed quia non numquam eius modi tempora
      incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad
      minima veniam, quis nostrum exercitationem ullam corporis suscipit
      laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum
      iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae
      consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla
      pariatur?"
    </P>
    <P justify>
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem
      accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab
      illo inventore veritatis et quasi architecto beatae vitae dicta sunt
      explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
      odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
      voluptatem sequi nesciunt.
    </P>
    <P justify>
      Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,
      consectetur, adipisci velit, sed quia non numquam eius modi tempora
      incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad
      minima veniam, quis nostrum exercitationem ullam corporis suscipit
      laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum
      iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae
      consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla
      pariatur?"
    </P>
  </>
);

const Content2 = () => (
  <>
    <H2>Server Error</H2>
    <H3>Spreadsheet</H3>
    <P>
      <b>Invalid Data: </b> On line 18, the songmaker link
      https://musiclab.songmaker/2345235646422 is not valid
    </P>
    <P>
      <b>Invalid Data: </b> On line 13, the songmaker link
      https://musiclab.songmaker/2345235646422 is not valid
    </P>
    <H3>Missing Title</H3>
    <P>
      <b>Blank Field: </b>Your gallery is missing a title.
    </P>
  </>
);

export const Default = Template.bind({});
Default.args = {
  children: <Content1 />,
};

/**
 * When errors come back from the server, they get structured and look
 * like this in the blanket container
 */
export const ServerError = Template.bind({});
ServerError.args = {
  children: <Content2 />,
};

/**
 * Multiple blankets should sit on top of one another and all be dismissible.
 */
const MultipleTemplate = (args) => (
  <>
    <Blanket>{args.children1}</Blanket>
    <Blanket>{args.children2}</Blanket>
  </>
);
export const MultipleOverlapping = MultipleTemplate.bind({});
MultipleOverlapping.args = {
  children1: <Content1 />,
  children2: <Content2 />,
};
