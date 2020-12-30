import React from "react";
import styled from "styled-components";

const Button = styled.button`
  transform: rotate(${(props) => props.theme.rotation}deg);
`;

export default Button;
