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
  const theme = {
    index: props.index % 6,
    background: props.st_arr[2],
  };
  const handleScroll = () => {
    if (tile_el && tile_el.current) {
      const newY = tile_el.current.getBoundingClientRect().y;
      setY(newY);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });
  useEffect(() => {
    if (tile_el && tile_el.current && y < 150 && y > 0) {
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
