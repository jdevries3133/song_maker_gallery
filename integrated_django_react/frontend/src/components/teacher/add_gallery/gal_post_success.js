import React from "react";
import { Link } from "react-router-dom";

const gal_post_success = (props) => {
  const relative_path = "/gallery/" + props.url;
  const full_url = window.location.href.slice(0, -8) + "/gallery/" + props.url;
  return (
    <div className="description blanket">
      <h2>Success!</h2>
      <p>Your gallery is now publicly available at the link below:</p>
      <br />
      <Link to={relative_path}>
        <p>{full_url}</p>
      </Link>
      <p>
        Right now, it has placeholder images, but our screenshot bot is working
        hard to prepare thumbnails of your students' work as we speak!
      </p>
      <p>We'll send you an email when your gallery is ready.</p>
      <button onClick={() => props.onOk()}>Ok</button>
    </div>
  );
};
export default gal_post_success;
