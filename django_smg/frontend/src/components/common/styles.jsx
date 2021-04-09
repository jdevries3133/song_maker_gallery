/**
 * This is a mirror of the classes from ../App.css towards a future
 * total migration to styled components.
 */
import React from "react";
import styled, { css } from "styled-components";

/**
 * Use this file as global entrypoint into styled-components
 */
export * from "styled-components";
export default styled;

/**
 * "Global" css classes which are either directly used or extended
 * throughout the project.
 */

// do not feel obligated to inherit from this one, I might just delete it
// because it seems unnecessary
export const Div = styled.div`
  text-align: center;
  padding: ${(props) => props.padding || "inherit"};
`;

export const Grid = styled.div`
  justify-items: center;
  align-items: center;
  gap: ${(props) => props.gap || "1rem"};
  display: ${(props) => (props.inline ? "inline-grid" : "grid")};
  grid-template-rows: ${(props) => props.rows};
  grid-template-columns: ${(props) => props.cols};
`;

// prettier-ignore
export const GridItem = styled.div`
  ${props => props.row      && css`grid-row:            ${props.row}`};
  ${props => props.row      && css`grid-row:            ${props.row}`};
  ${props => props.rowStart && css`grid-row-start:      ${props.rowStart}`};
  ${props => props.rowEnd   && css`grid-row-end:        ${props.rowEnd}`};
  ${props => props.col      && css`grid-column:         ${props.col}`};
  ${props => props.colStart && css`grid-column-start:   ${props.colStart}`};
  ${props => props.colEnd   && css`grid-column-end:     ${props.colEnd}`};
`;

export const H1 = styled.h1`
  text-align: center;
  padding-bottom: 1.5rem;
  font-size: calc(4vw + 30px);
`;

export const H2 = styled.h2`
  display: inline-block;
  background-color: "#88ff00";
  font-weight: 400;
  padding: 30px;
  border-radius: 20px;
`;

export const H3 = styled.h3`
  ${(props) =>
    props.warn &&
    css`
      color: #e41000;
    `}
`;

export const H4 = styled.h4`
  ${(props) =>
    props.warn &&
    css`
      color: #e41000;
    `}
`;

export const P = styled.p`
  text-align: center;
  padding: 0 20px 0 20px;
  ${(props) =>
    props.confirm &&
    css`
      color: green;
    `}
  ${(props) =>
    // dark red w/ good contrast against white
    props.warn &&
    css`
      color: #e41000;
    `}
  ${(props) =>
    props.justify &&
    css`
      text-align: justify;
    `}
  ${(props) =>
    props.left &&
    css`
      text-align: left;
    `}
  ${(props) =>
    props.right &&
    css`
      text-align: right;
    `}
`;

export const A = styled.a`
  text-decoration: none;
`;

export const Button = styled.button`
  display: inline-block;
  font-size: 1rem;
  font-weight: bold;
  padding: 20px;
  border-radius: 20px;
  cursor: pointer;

  background-color: ${(props) => (props.color ? props.color : "#f7943e")};
  ${(props) =>
    props.text &&
    css`
      color: ${props.text};
    `}
  :hover {
    background-color: ${(props) => props.hover || "white"};
  }

  ${(props) =>
    props.block &&
    css`
      display: block;
    `}

  @media(max-width: 400px) {
    padding: 10px;
  }

  @media (max-width: 350px) {
    padding: 5px;
  }
`;

export const Form = styled.form`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 5vh 5vw;
`;

export const Label = styled.label`
  display: block;
  font-size: 1.17em;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-weight: bold;
  ${(props) =>
    props.inline &&
    css`
      display: inline;
    `}
`;

export const Input = styled.input`
  font-size: 20px;
  padding: 10px;
  border-radius: 5px;
  &[type="checkbox"] {
    width: 30px;
    height: 30px;
  }

  ${(props) =>
    props.block &&
    css`
      display: block;
    `}
`;

export const Textarea = styled.textarea`
  font-family: Helvetica, Arial, sans-serif;
  font-size: 19px;
  line-height: 1.5;
  margin: 0px;
  width: 80%;
  height: 20vh;
  box-shadow: 1px 1px 1px #999;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

export const Checkbox = ({ children, ...rest }) => (
  <Input type="checkbox" {...rest}>
    {children}
  </Input>
);

export const Description = styled.div`
  font-size: 18px;
  text-align: center;
  display: inline-block;
  max-width: 50rem;
  padding: 1vw;
  background: white;
  box-shadow: 0px 3px 8px rgb(100, 100, 100);
  border-radius: 20px;
  @media (max-width: 600px) {
    font-size: 16px;
    line-height: 1.5rem;
    @media (min-width: 315px) {
      margin: 1rem;
      padding: 0.7rem;
    }
    @media (max-width: 315px) {
      margin: 0.3rem;
      padding: 0.3rem;
    }
  }
`;

export const Blanket = styled(Description)`
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
