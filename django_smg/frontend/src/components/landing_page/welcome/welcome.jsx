import React from "react";
import useWidth from "../../generics/useWidth";
import Desktop from "./desktop";
import Mobile from "./mobile";
import styles from "../landing_page.module.css";

const welcome = () => {
  const { width } = useWidth(475);
  return (
    <div className={styles.welcome_container}>
      {width > 475 ? <Desktop /> : <Mobile />}
    </div>
  );
};

export default welcome;
