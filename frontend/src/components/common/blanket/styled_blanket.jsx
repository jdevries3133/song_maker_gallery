/**
 * formerly lived in "Styles", but really should never be used without the
 * wrapper component here
 */

import styled, { Description } from "Styles";

export const StyledBlanket = styled(Description)`
  position: fixed;
  margin: 4vw;
  padding: 0;
  height: 90vh;
  width: 90vw;
  overflow-x: hidden;
  background-color: #d9e6e8;
  border-radius: 20px;
  opacity: 95%;
  z-index: 100;

  @media (min-width: 800px) {
    @media (min-height: 600px) {
      height: 600px;
      width: 700px;
      top: 50%;
      left: 50%;
      margin-top: -300px;
      margin-left: -350px;
    }
  }
`;
