import React from "react";
import styles from "./donate.module.css";
import useWidth from "../../generics/useWidth";

const donation = (props) => {
  const width = useWidth();
  return (
    <div className={`description blanket ${styles.donation_blanket}`}>
      <div
        style={{ display: "inline-block", textAlign: "center", width: "100%" }}
      >
        <h2 className={styles.donation_header}>Donate!</h2>
      </div>
      <div className={styles.par_container}>
        <p className={styles.par}>
          This website was built by me, a music teacher from New Jersey, as a
          way for me to feature the amazing compositions of my own students as
          this unusual school year draws to a close.
        </p>
        <p className={styles.par}>
          I've worked very hard to make it possible for anyone to make an
          account and create a gallery for their students completely free of
          charge. This involved creating an entire backend infrastructure beind
          this website, including account management, and a custom solution for
          automatically capturing the thumbnails of student work that you see on
          this website.
        </p>
        <p className={styles.par}>
          Although this site is free to use, it is not free to operate; and{" "}
          <strong>
            without generous donors, that money is coming from my own pocket.
          </strong>{" "}
          If you are fortunate enough to be able to chip in and support this
          project, please do!
        </p>
        <p className={styles.par}>
          Any proceeds in excess of the cost of running this website will be
          used to support music education directly.
        </p>
      </div>
      <div className={styles.footer}>
        <form
          action="https://www.paypal.com/cgi-bin/webscr"
          method="post"
          target="_top"
          style={{ display: "inline-block" }}
        >
          <input type="hidden" name="cmd" value="_donations" />
          <input
            type="hidden"
            name="business"
            value="songmakergallery@gmail.com"
          />
          <input type="hidden" name="item_name" value="Support Our Website" />
          <input type="hidden" name="currency_code" value="USD" />
          <input
            type="image"
            src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif"
            border="0"
            name="submit"
            title="PayPal - The safer, easier way to pay online!"
            alt="Donate with PayPal button"
          />
          <img
            alt=""
            border="0"
            src="https://www.paypal.com/en_US/i/scr/pixel.gif"
            width="1"
            height="1"
          />
        </form>

        <div className={styles.signature}>
          <p style={{ textAlign: "right", margin: "0" }}>Thanks,</p>
          <p style={{ textAlign: "right", margin: "0" }}>The SMG Team</p>
        </div>
        <button
          className={styles.donation_close}
          onClick={() => props.onClose()}
        >
          close
        </button>
      </div>
    </div>
  );
};

export default donation;
