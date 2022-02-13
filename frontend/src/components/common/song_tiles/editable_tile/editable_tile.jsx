import React, { useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import axios from "axios";

import styled, {
  Label,
  Input,
  Button,
  Textarea,
  Description as DefaultDescription,
  P,
  H3,
} from "Styles";

import { LiveUpdatingTile } from "../live_updating_tile";

const VALIDATION_REGEX = /^http(s)?:\/\/musiclab.chromeexperiments.com\/Song-Maker\/song\/\d{16}$/;

const Description = styled(DefaultDescription)`
  margin: 0;
  padding: 1.5vw;
`;

const BtnContainer = styled.div`
  display: flex;
  align-item: center;
  justify-content: center;
  margin: auto;
  flex-direction: row;
`;

const updateSong = async (song, token, errCallback) => {
  axios.defaults.xsrfCookieName = "csrftoken";
  axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";

  try {
    /**
     * Since the link has been updated, but the rest of the song resource has
     * not, we need to get a new song resource for the given songId to make
     * sure that the MIDI data and everything else is in sync with the songId
     */
    const res = await axios.post("/api/gallery/song_data/", {
      student_name: song.student_name,
      songId: song.songId,
    });

    /*
     * res.data has valid google data
     * res.data does not have relationships:
     *
     * - owner
     * - Gallery
     * - SongGroup
     *
     * but, `song` does have these relationships, so we can just copy them
     * over before issuing the patch request
     */
    const newSong = res.data;
    const COPY_FIELDS = ["owner", "order", "group"];
    COPY_FIELDS.forEach((field) => {
      newSong[field] = song[field];
    });

    /* Now, we can patch in the updated song */
    await axios.patch(`/api/gallery/song/${song.pk}/`, res.data, {
      headers: { Authorization: `Token ${token}` },
    });
  } catch (_) {
    errCallback();
  }
};

const deleteSong = async (pk, token, errCallback) => {
  axios.defaults.xsrfCookieName = "csrftoken";
  axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";

  try {
    await axios.delete(`/api/gallery/song/${pk}/`, {
      headers: { Authorization: `Token ${token}` },
    });
  } catch (_) {
    errCallback();
  }
};

/**
 * Behavior is dynamic depending on whether the onSave prop was provided,
 * or the initialSong prop. If onSave is provided, the onSave function is
 * called with the student name and songId when the save button is pressed.
 * If the initialSong object was provided, we take that as the full cannonical
 * `Song` resource, and this component can be responsible for updating it,
 * since the pk should be included.
 */
export const _EditableTile = ({
  name = "",
  link = "",
  initialSong,
  onSave,
  token,
}) => {
  const [_name, setName] = useState(name);
  const [_link, setLink] = useState(link);
  const [errMsg, setErrMsg] = useState(null);
  const [isDeleted, setIsDeleted] = useState(false);
  // indicates successful update
  const [success, setSuccess] = useState(false);

  const isNameValid = !!_name;
  const isLinkValid = VALIDATION_REGEX.test(_link.trim());
  const changesMade = name !== _name || link !== _link;
  const songId = isLinkValid ? _link.slice(-16) : null;

  /**
   * update the song
   */
  const submit = (e) => {
    e.preventDefault();
    if (!isLinkValid) return;

    if (onSave) {
      onSave(_name, songId);
      return;
    }

    if (initialSong) {
      const newSong = {
        ...initialSong,
        songId,
        student_name: _name,
      };
      updateSong(newSong, token, () => {
        setErrMsg("Update failed due to network error. Please try again.");
      }).then(() => setSuccess(true));
    }
  };

  const deleteSelf = (e) => {
    e.preventDefault();
    deleteSong(initialSong.pk, token, () => {
      setErrMsg("Deletion failed due to network error. Please try again.");
    }).then(() => {
      setIsDeleted(true);
    });
  };

  const submitEnabled = changesMade && isLinkValid && isNameValid;

  /**
   * presence of success is temporary
   */
  if (success) {
    setTimeout(() => {
      setSuccess(false);
    }, 2000);
  }

  return (
    <Description as="form" onSubmit={submit}>
      {isDeleted ? (
        <h1>{_name}'s Song was Deleted</h1>
      ) : (
        <>
          <LiveUpdatingTile
            width={200}
            initialSong={initialSong}
            songId={isLinkValid ? songId : null}
          />
          {errMsg && <P warn>{errMsg}</P>}
          <Label htmlFor="name">Name</Label>
          {changesMade && !isNameValid && <P warn>Please enter your name.</P>}
          <Input
            id="name"
            data-testid="nameInput"
            value={_name}
            onChange={(e) => setName(e.target.value)}
            warn={changesMade && !isNameValid}
          />
          <div>
            <Label htmlFor="link">
              <H3>Link</H3>
              {changesMade && !isLinkValid && <P warn>Link is not valid</P>}
            </Label>
            <Textarea
              warn={changesMade && !isLinkValid}
              id="link"
              data-testid="linkInput"
              onChange={(e) => setLink(e.target.value)}
              value={_link}
            />
          </div>
          <br />

          {success && <p>Update Successful</p>}

          <br />

          <BtnContainer>
            <Button
              disabled={!submitEnabled}
              data-testid="submit"
              as="input"
              type="submit"
              value="Save"
            />
            {initialSong && (
              <Button onClick={deleteSelf} color="salmon">
                Delete
              </Button>
            )}
          </BtnContainer>
        </>
      )}
    </Description>
  );
};

_EditableTile.propTypes = {
  name: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,

  /**
   * If the song resource is already in memory somewhere, this will prevent a
   * request from being made if it can optionally be passed as a prop.
   */
  initialSong: PropTypes.object,

  /* Should take two arguments: name and songId */
  onSave: PropTypes.func,
};

const mapStateToProps = (state) => ({
  token: state.auth.token,
});

export const EditableTile = connect(mapStateToProps)(_EditableTile);
