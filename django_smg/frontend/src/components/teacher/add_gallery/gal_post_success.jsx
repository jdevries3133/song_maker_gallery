import React from "react";
import { Link } from "react-router-dom";

const gal_post_success = (props) => {
  const relative_path = "/gallery/" + props.slug + "/";
  const full_url = `${window.location.href.slice(0, -8)}/gallery/${
    props.slug
  }/`;
  return (
    <div className="description blanket">
      <h2>Success!</h2>
      <p>Your gallery is now publicly available at the link below:</p>
      <br />
      <Link to={relative_path}>
        <p>{full_url}</p>
      </Link>
      <button onClick={() => props.onOk()}>Ok</button>
      <p>
        Beware that the gallery <b>will take up to 30 seconds</b> to load when
        you open it for the first time because that will trigger the backend to
        fetch and store your students' song data from Google. The gallery will
        load normally thereafter.
      </p>
    </div>
  );
};
export default gal_post_success;
