/* 
This part of the project is in flux now. There is no great way to capture
screenshots efficiently. I might try Phantom JS, but it's depricated. Splash
was promising but the lack of an AudioContext API is causing it to fail to
render the page.

In response, I'm experimenting with embedding the screenshots for now, but I
will leave the old code in this file in case I find an efficient way to capture
screenshots, because I think this look with the hover animations is what
I'm ultimately after.
*/

import React, { useState, useEffect, useRef } from "react";
import { ThemeProvider } from "styled-components";
import styles from "./tilegrid.module.css";
import StyledTile from "./styled.tile";
import useWidth from "../../generics/useWidth";

const tile = (props) => {
  const { width } = useWidth();
  const [y, setY] = useState(undefined);
  const tile_el = useRef(null);
  // background is none until tile is about to scroll into view
  const background = "url(" + props.st_arr[2] + ")";
  const song_link = `https://musiclab.chromeexperiments.com/Song-Maker/song/${props.st_arr[1]}`;
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
    if (width > 475) {
      return;
    } else if (tile_el && tile_el.current && y < 150 && y > 0) {
      tile_el.current.focus();
    }
  });
  return (
    <li className={styles.lit}>
      <a href={song_link} target="_blank" rel="noopener noreferrer">
        <ThemeProvider theme={theme}>
          <StyledTile ref={tile_el}>{props.st_arr[0]}</StyledTile>
        </ThemeProvider>
      </a>
    </li>
  );
};

export default tile;
