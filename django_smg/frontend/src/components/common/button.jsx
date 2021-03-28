import styled from "styled-components";

// TODO: remove this whole file, it is duplicate code.
const Button = styled.button`
  display: inline-block;
  font-size: 1rem;
  font-weight: bold;
  padding: 20px;
  margin: 20px;
  border-radius: 20px;
  color: ${(props) => props.theme.color};
  background-color: ${(props) => props.theme.backgroundColor};
  cursor: pointer;

  :hover {
    background-color: white;
  }

  @media (max-width: ${(props) => {
      return props.theme.resizeThreshold;
    }}) {
    font-weight: 400;
    padding: 5px;
    margin: 8px;
    border-radius: 15px;
  }
`;

Button.defaultProps = {
  theme: {
    backgroundColor: "#f7943e",
    color: "black",
    resizeThreshold: "375px",
  },
};

export default Button;
