import React from "react";
import { Link } from "react-router-dom";
import { Button, Blanket, Div, H2, P } from "Styles";

export const GalPostSuccess = (props) => {
  const relative_path = "/gallery/" + props.slug + "/";
  const full_url = `${window.origin}/gallery/${props.slug}/`;
  return (
    <Blanket>
      <H2>Success!</H2>
      <P>Your gallery is now publicly available at the link below:</P>
      <Link to={relative_path}>
        <P data-testid="newGalUrl">{full_url}</P>
      </Link>
      <Button onClick={() => props.onOk()}>Ok</Button>
      <P>
        Beware that the gallery <b>will take up to 30 seconds</b> to load when
        you open it for the first time because that will trigger the backend to
        fetch and store your students' song data from Google. The gallery will
        load normally thereafter.
      </P>
    </Blanket>
  );
};
