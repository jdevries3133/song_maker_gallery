import React, { forwardRef } from "react";
import styled, { css } from "styled-components";
/**
 * All emojis for now, but this creates a place for different or more complex
 * implementations later.
 */

const Span = styled.span`
  font-size: 2rem;
  ${(props) =>
    props.sm &&
    css`
      font-size: 1rem;
    `}
`;

export const Like = forwardRef((p, r) => (
  <Span ref={r} {...p}>
    👍
  </Span>
));
export const Heart = forwardRef((p, r) => (
  <Span ref={r} {...p}>
    ❤️
  </Span>
));
export const Star = forwardRef((p, r) => (
  <Span ref={r} {...p}>
    ⭐️
  </Span>
));
export const Comment = forwardRef((p, r) => (
  <Span ref={r} {...p}>
    ✍️
  </Span>
));
