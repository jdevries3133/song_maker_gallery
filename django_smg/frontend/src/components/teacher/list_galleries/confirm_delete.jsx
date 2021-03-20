import React from "react";
import styles from "./styles.module.css";
import Button from "../../generics/button";
import { ThemeProvider } from "styled-components";

const confirm_delete = (props) => {
  return (
    <div className="description blanket">
      <h2>Are you Sure?</h2>

      <p>
        This gallery will be permanently deleted and no longer available at the
        url:
        <br />
        <a href={props.url}>{props.url}</a>
      </p>
      <ThemeProvider theme={{ backgroundColor: "maroon", color: "white" }}>
        <Button
          className={styles.delete_confirm}
          onClick={() => props.confirmation(props.pk)}
        >
          I am sure
        </Button>
      </ThemeProvider>
    </div>
  );
};
export default confirm_delete;
