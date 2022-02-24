import styled from "styled-components";

const button = styled.button`
  font-family: "Merriweather Sans", -apple-system, BlinkMacSystemFont,
    "Segoe UI", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
    "Helvetica Neue", sans-serif;
  font-weight: lighter;
  font-size: 5rem;
  background-color: rgba(104, 253, 75, 0.719);
  width: 109px;
  border-radius: 69px;
  margin: 10px;

  :hover {
    background-color: white;
  }

  @media (max-width: 450px) {
    font-size: 3rem;
    width: 70px;
  }
`;

export default button;
