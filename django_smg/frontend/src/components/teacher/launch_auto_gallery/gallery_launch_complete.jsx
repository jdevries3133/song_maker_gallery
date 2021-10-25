import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import store from "../../../store";
import { Description, Button } from "Styles";
import Loading from "Common/loading";

export const GalleryLaunchComplete = ({ galleryData }) => {
  const [slug, setSlug] = useState(null);
  const [state, setState] = useState("LOADING");

  const performCreate = async () => {
    const state = store.getState();
    if (state.auth.isAuthenticated) {
      axios.defaults.xsrfCookieName = "csrftoken";
      axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
      try {
        const res = await axios.post(
          "/api/gallery/",
          {
            title: galleryData.name,
            description: galleryData.description,
            song_groups: galleryData.group_names.map((group_name) => {
              return {
                group_name,
                songs: [],
              };
            }),
          },
          { headers: { Authorization: `Token ${state.auth.token}` } }
        );
        if (res.status === 201) {
          setState("SUCCESS");
          setSlug(res.data.slug);
        } else {
          setState("ERROR");
        }
      } catch (e) {
        setState("ERROR");
      }
    } else {
      setState("ERROR");
      console.error(
        "Could not send update because user is not authenticated in redux state"
      );
    }
  };

  useEffect(() => {
    performCreate();
  }, [galleryData]);

  return (
    <>
      <Description>
        <h1>All Done!</h1>
        {state === "LOADING" ? (
          <>
            <p>Just wait while we get your gallery ready</p>
            <Loading dark />
          </>
        ) : state === "ERROR" ? (
          <>
            <p>Gallery creation failed</p>
            <Button onClick={performCreate}>Try again</Button>
          </>
        ) : state === "SUCCESS" ? (
          <>
            <p>Gallery creation was successful</p>
            <p>
              Share this link for your students to submit their songs, when link
              submission is turned on:
            </p>
            <Link to={`/gallery/${slug}/submit-song/`}>
              https://songmakergallery.com/gallery/{slug}/submit-song/
            </Link>
            <p>View your gallery here, when the gallery is public:</p>
            <Link to={`/gallery/${slug}/`}>
              https://songmakergallery.com/gallery/{slug}/
            </Link>
          </>
        ) : null}
      </Description>
      <div>
        <Link to="/teacher">
          <Button>Return to Teacher Dashboard</Button>
        </Link>
      </div>
    </>
  );
};
