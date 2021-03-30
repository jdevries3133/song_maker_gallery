import React from "react";

import styled, { H3 as DefaultH3, P as DefaultP, css } from "Styles";

const H3 = styled(DefaultH3)`
  margin: 0;
  padding: 0;
  display: inline-block;
  width: 40%;
  font-size: 14px;
`;

const P = styled(DefaultP)`
  margin: 0;
  padding: 0;
  display: inline-block;
  width: 60%;
  font-size: 12px;
`;

const StyledCard = styled.div`
  display: flex;
  align-items: flex-end;
  height: 25vh;
  margin-bottom: 1rem;
  border-radius: 10px 10px 0 0;

  background-repeat: no-repeat;
  background-size: 100%;
  ${(props) =>
    props.background &&
    css`
      background-image: url(${props.background});
    `}
`;

const TextContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 30%;
  background-color: white;
  box-shadow: 0px 3px 8px rgb(100, 100, 100);
  border-radius: 10px 10px 0 0;
`;

export const Card = ({ title, description, media }) => {
  return (
    <StyledCard background={media}>
      <TextContainer>
        <H3>{title}</H3>
        {description ? <P>{description}</P> : null}
      </TextContainer>
    </StyledCard>
  );
};
