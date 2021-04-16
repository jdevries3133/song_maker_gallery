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
  ${(props) =>
    props.row &&
    css`
      grid-row: ${props.row};
    `}
  ${(props) =>
    props.column &&
    css`
      grid-column: ${props.column};
    `}


  display: grid;
  grid-template-rows: 1fr 1fr;
  align-items: center;
  justify-items: center;
  border-radius: 10px 10px 0 0;
  padding: 0;

  background-repeat: no-repeat;
  background-size: 100%;
  ${(props) =>
    props.background &&
    css`
      background-image: url(${props.background});
    `}

  /* create gutter for image to wrap around sides */
  @media(min-width: 1000px) {
    grid-template-columns: 1fr 80% 1fr;

    & > ${CtaContainer} {
      grid-column: 2;
    }
    & > ${TextContainer} {
      grid-column: 2;
    }
  }

  /**
   * On smaller screens, create a static card where the action component
   * is always displayed.
   */
  @media (max-width: 600px) {
    & > ${CtaContainer} {
      grid-column: 4;
      visibility: visible;
    }

    & > ${TextContainer} {
      grid-row-start: 1;
      grid-row-end: 3;
    }
  }

  /**
   * Hover behavior only applies on larger screens. On small screens,
   */
  @media (min-width: 600px) {
    &:hover {
      background-image: none;
      background-color: white;
      box-shadow: 0px 3px 8px rgb(100, 100, 100);
    }

    &:hover > ${TextContainer} {
      grid-row: 1;
      box-shadow: none;
    }

    &:hover > ${CtaContainer} {
      visibility: visible;
      position: static;
      grid-row: 2;
    }
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

export const Card = ({
  title,
  description,
  media,
  actionButton,
  row,
  column,
}) => {
  return (
    <StyledCard background={media} row={row} column={column}>
      <TextContainer>
        <H3>{title}</H3>
        {description ? <P>{description}</P> : null}
      </TextContainer>
      <CtaContainer>{actionButton}</CtaContainer>
    </StyledCard>
  );
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,

  /* url which will be used as `background: url({media})` */
  media: PropTypes.string.isRequired,

  /**
   * Short snippet of jsx which is call to action. ex. Link or button with
   * onClick
   */
  actionButton: PropTypes.node.isRequired,

  /* Layout card in the context of a grid */
  row: PropTypes.number,
  column: PropTypes.number,
};
