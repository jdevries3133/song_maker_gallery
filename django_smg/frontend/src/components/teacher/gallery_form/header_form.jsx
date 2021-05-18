import React, { useState } from "react";
import { connect } from "react-redux";
import axios from "axios";

import styled, {
  P,
  Button,
  Description as D,
  Label,
  Input,
  Textarea,
} from "Styles";
import LoadSpinner from "Common/loading";

const Description = styled(D)`
  max-width: 500px;
`;

const Div = styled.div`
  display: flex;
  justify-content: center;
`;

const _HeaderForm = ({ gallery, token }) => {
  const [title, setTitle] = useState(gallery.title);
  const [description, setDescription] = useState(gallery.description);
  const STATES = {
    /* Form is unchanged */
    initial: "NORMAL",
    /* Form is changed; ready to submit */
    ready: "READY",
    /* awaiting network response */
    pending: "PENDING",
    /* Network error after submission */
    error: "ERROR",
    /* Network success after submission */
    success: "SUCCESS",
  };
  const [netStat, setNetStat] = useState(STATES.initial);

  const submitHandler = (e) => {
    e.preventDefault();
    setNetStat("PENDING");
    axios
      .patch(
        `/api/gallery/`,
        {
          title,
          description,
          pk: gallery.pk,
        },
        {
          headers: { Authorization: `Token ${token}` },
        }
      )
      .then((res) => res.status === 200 && setNetStat(STATES.success))
      .catch((e) => {
        console.log(e);
        setNetStat(STATES.error);
      });
  };

  const changeHandler = (field, value) => {
    switch (field) {
      case "title":
        setTitle(value);
        break;
      case "description":
        setDescription(value);
        break;
      default:
        throw new Error(`Unrecognized field type: ${field}`);
    }
    setNetStat(STATES.ready); // because form has been changed
  };

  /*
   * success state is self-resetting; it just shows a quick confirmation to
   * the user, then the form returns to initial state
   */
  if (netStat === STATES.success) {
    setTimeout(() => setNetStat(STATES.initial), 2000);
  }

  return (
    <Div>
      <Description as="form" onSubmit={submitHandler}>
        <P justify>
          Information for the whole gallery. This will appear at the top of the
          page, and the title will be reflected in the gallery's URL.
        </P>
        <Label htmlFor="gallery title">Title</Label>
        <Input
          id="gallery title"
          value={title}
          onChange={(e) => changeHandler("title", e.target.value)}
        />
        <Label htmlFor="gallery description">Description</Label>
        <Textarea
          id="gallery description"
          value={description}
          onChange={(e) => changeHandler("description", e.target.value)}
        />
        {netStat === STATES.ready && (
          <Button block as="input" type="submit" value="Save" />
        )}
        {netStat === STATES.pending && <LoadSpinner block dark />}
      </Description>
    </Div>
  );
};

export const HeaderForm = connect((s) => {
  return {
    token: s?.auth?.token ?? "",
  };
})(_HeaderForm);
