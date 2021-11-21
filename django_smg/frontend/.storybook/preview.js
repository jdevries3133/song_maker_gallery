import "../static/frontend/global_styles.css";

export const decorators = [
  (Story) => (
    <div>
      <link
        href="https://fonts.googleapis.com/css2?family=Indie+Flower&family=Merriweather+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Roboto:wght@500&display=swap"
        rel="stylesheet"
      ></link>
      <Story />
    </div>
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

