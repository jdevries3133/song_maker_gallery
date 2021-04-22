import React from "react";
import styled, { H2, H3, P } from "Styles";
import { Blanket } from "./index";

export default {
  title: "Common/Blanket",
  component: Blanket,
};

const ColoredBackground = styled.div`
  width: 2000px;
  height: 2000px;
  background-color: skyblue;
`;

const BackgroundContent = () => (
  <div>
    <H3>Ensure that Blanket does not clip background content</H3>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio.
      Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at
      nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec
      tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget
      nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra,
      per inceptos himenaeos. Curabitur sodales ligula in libero.{" "}
    </p>

    <p>
      Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean
      quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis
      tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus
      risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis
      ligula lacinia aliquet. Mauris ipsum.{" "}
    </p>

    <p>
      Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh.
      Quisque volutpat condimentum velit. Class aptent taciti sociosqu ad litora
      torquent per conubia nostra, per inceptos himenaeos. Nam nec ante. Sed
      lacinia, urna non tincidunt mattis, tortor neque adipiscing diam, a cursus
      ipsum ante quis turpis. Nulla facilisi. Ut fringilla. Suspendisse potenti.
      Nunc feugiat mi a tellus consequat imperdiet. Vestibulum sapien. Proin
      quam. Etiam ultrices.{" "}
    </p>

    <p>
      Suspendisse in justo eu magna luctus suscipit. Sed lectus. Integer euismod
      lacus luctus magna. Quisque cursus, metus vitae pharetra auctor, sem massa
      mattis sem, at interdum magna augue eget diam. Vestibulum ante ipsum
      primis in faucibus orci luctus et ultrices posuere cubilia Curae; Morbi
      lacinia molestie dui. Praesent blandit dolor. Sed non quam. In vel mi sit
      amet augue congue elementum. Morbi in ipsum sit amet pede facilisis
      laoreet. Donec lacus nunc, viverra nec, blandit vel, egestas et, augue.
      Vestibulum tincidunt malesuada tellus. Ut ultrices ultrices enim.
      Curabitur sit amet mauris.{" "}
    </p>

    <p>
      Morbi in dui quis est pulvinar ullamcorper. Nulla facilisi. Integer
      lacinia sollicitudin massa. Cras metus. Sed aliquet risus a tortor.
      Integer id quam. Morbi mi. Quisque nisl felis, venenatis tristique,
      dignissim in, ultrices sit amet, augue. Proin sodales libero eget ante.
      Nulla quam. Aenean laoreet. Vestibulum nisi lectus, commodo ac, facilisis
      ac, ultricies eu, pede.{" "}
    </p>
  </div>
);

const Template = (args) => (
  <ColoredBackground>
    <BackgroundContent />
    <Blanket {...args}></Blanket>
  </ColoredBackground>
);

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
