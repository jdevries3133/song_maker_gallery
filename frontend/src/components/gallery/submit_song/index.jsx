/**
 * TODO: break up across multiple files.
 * TODO: write unit tests (there is an integration test that just clicks through
 */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

import styled, { P, H1, Description, Button } from "Styles";
import { EditableTile } from "Common/song_tiles/editable_tile";
import { Breadcrumb } from "Common/breadcrumb";
import { Select } from "Common/select";
import Loading from "Common/loading";

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

/*** API CONNECTORS ***/

const getGroups = async (slug, retries = 0) => {
  const max_retries = 3;

  axios.defaults.xsrfCookieName = "csrftoken";
  axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
  try {
    const res = await axios.get(`/api/gallery/create_song/?slug=${slug}`);
    // return conditions, allowing for some recursive retries
    if (res.status === 200) {
      return res.data;
    }
  } catch (e) {
    if (e.response.status === 401) {
      return "FORBIDDEN";
    }
    if (retries > max_retries) {
      console.error("Failed to fetch groups");
      return "ERROR";
    }
    return await getGroups(slug, retries + 1);
  }
};

const submitSong = async (slug, data, retries = 0) => {
  const max_retries = 3;
  axios.defaults.xsrfCookieName = "csrftoken";
  axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
  try {
    const res = await axios.post(
      `/api/gallery/create_song/?slug=${slug}`,
      data
    );
    if (res.status === 200) {
      return true;
    }
  } catch {
    // return conditions, allowing for some recursive retries
    if (retries > max_retries) {
      console.error("Failed to submit song");
      return null;
    }
    return await submitSong(slug, data, retries + 1);
  }
};

/*** FORM BREADCRUMBS ***/

const SubmissionBlocked = ({ slug }) => (
  <>
    <H1>Uh oh!</H1>
    <FlexContainer>
      <Description>
        <p>
          Your teacher has link posting by students turned off. If you are the
          teacher,{" "}
          <Link to={`/teacher/${slug}/settings/`}>
            click here to change the gallery settings
          </Link>
        </p>
      </Description>
    </FlexContainer>
  </>
);

const FormPartOne = ({ onSave }) => {
  // adapt EditableTile API to parent
  const saveAdapter = (student_name, songId) =>
    onSave({ student_name, songId });
  return (
    <div style={{ textAlign: "center" }}>
      <H1>Submit Your Song!</H1>
      <Breadcrumb current={1} total={2} />
      <EditableTile onSave={saveAdapter} />
      <br />
      <Description>
        <P>
          Go to the{" "}
          <a
            href="https://musiclab.chromeexperiments.com/Song-Maker"
            target="_blank"
            referrer="noopener noreferrer"
          >
            Song Maker Gallery
          </a>{" "}
          to create a song if you haven't already!
        </P>
      </Description>
    </div>
  );
};

const FormPartTwo = ({ groups, onSave }) => {
  const [choice, setChoice] = useState();

  useEffect(() => {
    if (groups?.length) {
      setChoice(groups[0].group_name);
    }
  }, [groups]);

  const submitHandler = (e) => {
    e.preventDefault();
    let pk;
    groups.forEach((group) => {
      if (group.group_name == choice) {
        pk = group.pk;
      }
    });
    onSave({ group_pk: pk });
  };

  if (!groups) return <Loading dark />;

  return (
    <>
      <H1>Submit Your Song</H1>
      <FlexContainer>
        <Description as="form" onSubmit={submitHandler}>
          <P>One more thing!</P>
          <Select
            id="selectGroup"
            label="Select the group in the gallery that you are a part of."
            choices={groups.map((g) => g.group_name)}
            value={choice}
            onChange={(e) => setChoice(e.target.value)}
          />
          <Button block as="input" type="submit" id="submit" value="Submit" />
        </Description>
      </FlexContainer>
    </>
  );
};

const Success = ({ slug }) => (
  <FlexContainer>
    <Description>
      <H1 data-testid="success">Success!</H1>
      <P>Your song has been submitted.</P>
      <Link data-testid="gotoGallery" to={`/gallery/${slug}/`}>
        <Button>View Gallery</Button>
      </Link>
    </Description>
  </FlexContainer>
);

const Error = () => (
  <>
    <H1>Oops!</H1>
    <Description>
      <P>Something went wrong. Please try again.</P>
      <Button onClick={() => location.reload()}>Try Again</Button>
    </Description>
  </>
);

/*** MAIN COMPONENT ***/

export const SongSubmitForm = () => {
  const [submissionBlocked, setSubmissionBlocked] = useState(false);
  const [userData, setUserData] = useState({});
  const [formPart, setFormPart] = useState(1);
  const [err, setErr] = useState(false);
  const [groups, setGroups] = useState(null);
  const { slug } = useParams();

  useEffect(() => {
    getGroups(slug).then((result) => {
      if (result === "ERROR") {
        setErr(true);
      } else if (result === "FORBIDDEN") {
        setSubmissionBlocked(true);
      } else {
        setGroups(result);
      }
    });
  }, []);

  const saveHandler = (newData) => {
    if (formPart == 1) {
      setUserData({ ...userData, ...newData });
      setFormPart(formPart + 1);
    } else if (formPart == 2) {
      submitSong(slug, {
        ...userData, // includes group_pk, name, and songId
        ...newData,
      }).then((result) => {
        if (!result) {
          setErr(true);
        }
      });
      setFormPart(formPart + 1);
    }
  };

  if (err) return <Error />;
  if (submissionBlocked) return <SubmissionBlocked slug={slug} />;

  switch (formPart) {
    case 1:
      return <FormPartOne onSave={saveHandler} />;
    case 2:
      return <FormPartTwo groups={groups} onSave={saveHandler} />;
    case 3:
      return <Success slug={slug} />;
  }
};
