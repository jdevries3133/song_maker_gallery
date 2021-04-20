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

const VALIDATION_REGEX = /^http(s)?:\/\/musiclab.chromeexperiments.com\/Song-Maker\/song\/\d{16}$/;

const Description = styled(DefaultDescription)`
  margin: 0;
  padding: 1.5vw;
`;

export const EditableTile = ({ name = "", link = "" }) => {
  const [_name, setName] = useState(name);
  const [_link, setLink] = useState(link);

  const isLinkValid = !VALIDATION_REGEX.test(_link.trim());
  const changesMade = name !== _name || link !== _link;

  const submit = (e) => {
    e.preventDefault();
  };

  return (
    <Description as="form" onSubmit={submit}>
      <Label htmlFor="name">Name</Label>
      <Input
        id="name"
        data-testid="nameInput"
        value={_name}
        onChange={(e) => setName(e.target.value)}
      />
      <div>
        <label htmlFor="link">
          <H3>Link</H3>
          {isLinkValid && <P warn>Link is not valid</P>}
        </label>
        <Textarea
          warn={isLinkValid}
          id="link"
          data-testid="linkInput"
          onChange={(e) => setLink(e.target.value)}
          value={_link}
        />
      </div>
      {changesMade && (
        <Button data-testid="submit" as="input" type="submit" value="Save" />
      )}
    </Description>
  );
};

EditableTile.propTypes = {
  name: PropTypes.string,
  link: PropTypes.string,
};
