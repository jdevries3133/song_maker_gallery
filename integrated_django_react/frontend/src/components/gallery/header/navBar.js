import React from "react";
import styles from "./header.module.css";
import styled, { ThemeProvider } from "styled-components";

const Button = styled.button`
    display: inline-block;
    font-size: 1rem;
    font-weight: bold;
    padding: 20px;
    margin: 20px;
    border-radius: 20px;
    background-color: ${(props) => props.theme.color};
  }

  :hover {
    background-color: white;
  }
`;

Button.defaultProps = { theme: { color: "#f7943e" } };

const navBar = (props) => {
  const elements = props.data.map((group, index) => {
    const group_name = group.slice(-1);
    const themes = ["#94c732", "#ffe716", "#2be2f9", "#c77dd3"];

    const theme = { color: themes[index % themes.length] };
    return (
      <a className="a_nav" key={group_name} href={"#" + group_name}>
        <ThemeProvider theme={theme}>
          <Button>{group_name}</Button>
        </ThemeProvider>
      </a>
    );
  });

  return (
    <div className={styles.navbar} id="gallery_top">
      {elements}
    </div>
  );
};

export default navBar;
