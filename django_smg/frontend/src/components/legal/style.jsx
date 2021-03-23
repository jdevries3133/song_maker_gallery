import styled from "styled-components";

import { Description } from "../generics/styles.jsx";

export const Container = styled(Description)`
  margin: 3%;
  margin-bottom: 5rem;
  & > * {
    text-align: justify;
  }
  & > * > * {
    margin-bottom: 1rem;
  }
  @media (max-width: 750px) {
    & > h1 {
      font-size: 36px;
    }
  }
`;
