import React, { Fragment, useState } from "react";
import Header from "./header/header";
import TileGrid from "./tilegrid/tilegrid";
import styles from "./tilegrid/tilegrid.module.css";

const galBody = (props) => {
  const [blanket, setBlanket] = useState(null);

  const donation = (
    <div className={`description blanket ${styles.donation_blanket}`}>
      <h2 className={styles.donation_header}>Donate!</h2>
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
            unless you and other viewers of this website click that donation
            button below, I will lose a lot of money.
          </strong>{" "}
          I know that there are people who will read this, and have the
          capacity, even in these terrible times, to chip in a few dollars to
          feed the Jeff Bezos / Amazon Web Services machine. If you can, please
          do.
        </p>
        <p className={styles.par}>
          Any proceeds in excess of the cost of running this website will be
          passed along to organizations that are supporting the many groups of
          people who are suffering in these trying times.
        </p>
      </div>

      <form
        action="https://www.paypal.com/cgi-bin/webscr"
        method="post"
        target="_top"
        style={{ display: "inline-block" }}
      >
        <input type="hidden" name="cmd" value="_donations" />
        <input type="hidden" name="business" value="jdevries3133@gmail.com" />
        <input type="hidden" name="item_name" value="Song Maker Gallery" />
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

      <div
        style={{
          position: "relative",
          bottom: "30px",
          width: "178px",
          display: "inline-block",
        }}
      >
        <p style={{ textAlign: "right", margin: "0" }}>Thanks,</p>
        <p style={{ textAlign: "right", margin: "0" }}>Jack DeVries</p>
      </div>
      <button
        className={styles.donation_close}
        onClick={() => setBlanket(null)}
      >
        close
      </button>
    </div>
  );
  return (
    <Fragment>
      <div style={{ marginBottom: "10rem" }}>
        <Header
          title={props.title}
          description={props.description}
          data={props.data}
        />
      </div>
      <div>
        {blanket}
        {/* donation whitelist */}
        {props.title === "Sample Gallery" ||
        props.title === "Sparta Fifth Grade Gallery" ||
        props.title === "Sparta Fourth Grade Gallery" ||
        props.title === "Sparta Third Grade Gallery" ? null : (
          <button
            onClick={() => setBlanket(donation)}
            className={styles.donate_button}
          >
            $
          </button>
        )}

        {props.data.map((group) => (
          <TileGrid data={group} key={group.slice(-1)[0]} />
        ))}
      </div>
    </Fragment>
  );
};

export default galBody;
