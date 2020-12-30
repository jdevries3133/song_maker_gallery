import styled from "styled-components";

const button = styled.button`
  font-family: "Roboto", sans-serif;
  font-weight: lighter;
  font-size: 5rem;
  background-color: rgba(104, 253, 75, 0.719);
  width: 140px;
  border-radius: 69px;
  margin: auto;

  :hover {
    background-color: white;
  }

  @media (max-width: 450px) {
    font-size: 3rem;
    width: 104px;
  }
`;

export default button;
