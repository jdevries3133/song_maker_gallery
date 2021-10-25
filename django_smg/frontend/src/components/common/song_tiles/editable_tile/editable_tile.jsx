import React, { useState } from "react";
import PropTypes from "prop-types";

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

const VALIDATION_REGEX =
  /^http(s)?:\/\/musiclab.chromeexperiments.com\/Song-Maker\/song\/\d{16}$/;

const Description = styled(DefaultDescription)`
  margin: 0;
  padding: 1.5vw;
`;

export const EditableTile = ({ name = "", link = "", onSave }) => {
  const [_name, setName] = useState(name);
  const [_link, setLink] = useState(link);

  const isNameValid = !!_name;
  const isLinkValid = VALIDATION_REGEX.test(_link.trim());
  const changesMade = name !== _name || link !== _link;
  const songId = isLinkValid ? _link.slice(-16) : null;

  const submit = (e) => {
    e.preventDefault();
    isLinkValid && onSave && onSave(_name, songId);
  };

  const submitEnabled = changesMade && isLinkValid && isNameValid;

  return (
    <Description as="form" onSubmit={submit}>
      <LiveUpdatingTile width={200} songId={isLinkValid ? songId : null} />
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

      <Button
        disabled={!submitEnabled}
        data-testid="submit"
        as="input"
        type="submit"
        value="Save"
      />
    </Description>
  );
};

EditableTile.propTypes = {
  name: PropTypes.string,
  link: PropTypes.string,
  /* Should take two arguments: name and songId */
  onSave: PropTypes.func,
};
