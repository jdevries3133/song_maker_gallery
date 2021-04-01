import React from "react";
import PropTypes from "prop-types";

import styled, { H3 as DefaultH3, P as DefaultP, css } from "Styles";

const CtaContainer = styled.div`
  visibility: hidden;
  text-align: center;
  grid-row: 1;
`;

const TextContainer = styled.div`
  display: grid;
  height: 100%;
  grid-template-columns: 1fr 3fr 5fr 1fr;
  align-items: center;

  grid-row: 2;
  background-color: white;
  box-shadow: 0px 3px 8px rgb(100, 100, 100);
  border-radius: 10px 10px 0 0;
`;

const StyledCard = styled.div`
  display: grid;
  grid-template-rows: 6fr 4fr;
  align-items: center;
  justify-items: center;
  border-radius: 10px 10px 0 0;
  max-width: 30rem;
  height: 10rem;

  background-repeat: no-repeat;
  background-size: 100%;
  ${(props) =>
    props.background &&
    css`
      background-image: url(${props.background});
    `}

  @media(min-width: 400px) {
    grid-template-rows: 6fr 2fr;
    height: 20rem;
  }

  &:hover {
    grid-template-rows: 1fr 1fr 3fr;
    background-color: white;
    background-image: none;
    box-shadow: 0px 3px 8px rgb(100, 100, 100);
  }

  &:hover > ${TextContainer} {
    grid-row: 2;
    box-shadow: none;
  }

  &:hover > ${CtaContainer} {
    visibility: visible;
    position: static;
    grid-row: 3;
  }
`;

const P = styled(DefaultP)`
  grid-column: 3;
  grid-row: 1;
  padding: 1em;
  margin: 0;
  font-size: 12px;
`;

const H3 = styled(DefaultH3)`
  grid-column: 2;
  grid-row: 1;
  padding: 1em;
  margin: 0;
  font-size: 14px;
`;

const Wrapper = styled.div``;

export const Card = ({ title, description, media, ActionButton }) => {
  return (
    <Wrapper>
      <StyledCard background={media}>
        <TextContainer>
          <H3>{title}</H3>
          {description ? <P>{description}</P> : null}
        </TextContainer>
        <CtaContainer>{ActionButton}</CtaContainer>
      </StyledCard>
    </Wrapper>
  );
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  media: PropTypes.string.isRequired,
  ActionButton: PropTypes.node.isRequired,
};
