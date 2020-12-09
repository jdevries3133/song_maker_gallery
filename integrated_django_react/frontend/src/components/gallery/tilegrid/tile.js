import React, { useState, useEffect, useRef } from "react";
import { ThemeProvider } from "styled-components";
import styles from "./tilegrid.module.css";
import StyledTile from "./styled.tile";
import MobileTile from "./mobile_tile";
import useWidth from "../../generics/useWidth";

const tile = (props) => {
  const { width } = useWidth();
  const [y, setY] = useState(undefined);
  const tile_el = useRef(null);
  // background is none until tile is about to scroll into view
  const background = "url(" + props.st_arr[2] + ")";
  const theme = {
    index: props.index,
    background: background,
  };
  const handleScroll = () => {
    if (tile_el) {
      const newY = tile_el.current.getBoundingClientRect().y;
      setY(newY);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });
  useEffect(() => {
    if (tile_el && tile_el.current && y < 400 && y > 0) {
      tile_el.current.focus();
    }
  });
  return (
    <li className={styles.lit}>
      <a href={props.st_arr[1]} target="_blank" rel="noopener noreferrer">
        <ThemeProvider theme={theme}>
          {width > 475 ? (
            <StyledTile>{props.st_arr[0]}</StyledTile>
          ) : (
            <MobileTile ref={tile_el}>{props.st_arr[0]}</MobileTile>
          )}
        </ThemeProvider>
      </a>
    </li>
  );
};

export default tile;
