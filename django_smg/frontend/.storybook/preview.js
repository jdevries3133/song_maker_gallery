import React from "react";
import styled from "styled-components";

/**
 * These are the same styles from '../static/frontend/global_styles.css'.
 * This is kind of a hacky way of getting them into storybook because I have
 * just been suffering with storybook config for far too long.
 */
const Div = styled.div`
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }

  background: url("/static/frontend/background.png");
  background-size: 50vw;
  font-family: "Merriweather Sans", -apple-system, BlinkMacSystemFont,
    "Segoe UI", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
    "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  @media (min-width: 475px) {
    scroll-behavior: smooth;
  }
`;

export const decorators = [
  (Story) => (
    <Div>
      <Story />
    </Div>
  ),
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

