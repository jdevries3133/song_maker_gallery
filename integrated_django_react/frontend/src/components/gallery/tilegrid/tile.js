import React, { useEffect } from "react";
import styled, { keyframes, ThemeProvider } from "styled-components";
import styles from "./tilegrid.module.css";
import StyledTile from "./styled.tile";

const tile = (props) => {
  const theme = {
    index: props.index,
    background: props.st_arr[2],
  };

  return (
    <li className={styles.lit}>
      <a href={props.st_arr[1]} target="_blank" rel="noopener noreferrer">
        <ThemeProvider theme={theme}>
          <StyledTile>{props.st_arr[0]}</StyledTile>
        </ThemeProvider>
      </a>
    </li>
  );
};

export default tile;
