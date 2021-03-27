import React, { Fragment } from "react";
import useWidth from "../../../common/useWidth";

export const HowToVideo = () => {
  const { width } = useWidth(750);
  return (
    <Fragment>
      <h3>Prefer to See How It's Done?</h3>
      <iframe
        width={width < 750 ? "300" : "400"}
        height={width < 750 ? "215" : "315"}
        src="https://www.youtube-nocookie.com/embed/sLbOKyUG1Ow"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </Fragment>
  );
};
