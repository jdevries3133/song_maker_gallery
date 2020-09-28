import React from "react";
import useWidth from "../../generics/useWidth";
import Desktop from "./desktop";
import Mobile from "./mobile";
import styles from "../landing_page.module.css";

const welcome = (props) => {
  const { width } = useWidth();
  return (
    <div className={styles.div}>{width > 475 ? <Desktop /> : <Mobile />}</div>
  );
};

export default welcome;
