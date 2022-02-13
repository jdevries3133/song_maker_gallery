/**
 * Simple form breadcrumb component
 */

import React from "react";
import styled from "styled-components";

const FlexD = styled.div`
  margin: 12px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-gap: 5px;
`;

/* unfilled "dot" */
const ToDo = styled.span`
  width: 20px;
  height: 20px;
  border-radius: 100%;
  background-color: #444;
`;

/* filled "dot" */
const Done = styled(ToDo)`
  background-color: #eee;
`;

export const Breadcrumb = ({ current, total }) => (
  <FlexD>
    {[...Array(total - current)].map(() => (
      <ToDo key={Math.random()} />
    ))}
    {[...Array(current)].map(() => (
      <Done key={Math.random()} />
    ))}
  </FlexD>
);
