import React from "react";
import PropTypes from "prop-types";

import styled, { H3 as DefaultH3, P as DefaultP, css } from "Styles";

const ChildContainer = styled.div``;

const StyledCard = styled.div`
  display: inline-flex;
  align-items: flex-end;
  margin-bottom: 1rem;
  border-radius: 10px 10px 0 0;
  min-height: 140px;

  background-repeat: no-repeat;
  background-size: 100%;
  ${(props) =>
    props.background &&
    css`
      background-image: url(${props.background});
    `}

  @media(min-width: 1000px) {
    &:hover > ${ChildContainer} {
    }
  }
`;

const TextContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px;
  background-color: white;
  box-shadow: 0px 3px 8px rgb(100, 100, 100);
  border-radius: 10px 10px 0 0;
`;

const P = styled(DefaultP)`
  margin: 0;
  padding: 0;
  display: inline-block;
  width: 60%;
  font-size: 12px;
`;

const H3 = styled(DefaultH3)`
  margin: 0;
  padding: 0;
  display: inline-block;
  width: 40%;
  min-height: 30px;
  font-size: 14px;
`;

export const Card = ({ title, description, media, children }) => {
  return (
    <StyledCard background={media}>
      <TextContainer>
        <H3>{title}</H3>
        {description ? <P>{description}</P> : null}
      </TextContainer>
      {children ? <ChildContainer>{children}</ChildContainer> : null}
    </StyledCard>
  );
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  media: PropTypes.string.isRequired,
  children: PropTypes.node,
};

Card.defaultProps = {
  children: null,
};
