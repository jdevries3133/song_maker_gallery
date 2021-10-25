import React, { useState } from "react";
import PropTypes from "prop-types";

import { StagedGroup } from "./snippets";
import { ErrorArray } from "Common/custom_error";
import styled, {
  H2,
  H3,
  P,
  Input,
  Textarea,
  Button,
  Div,
  Description,
} from "Styles";

import { SizeLimitCounter } from "./verify";

export const TITLE_LENGTH_LIMIT = 100;

const LargeButton = styled(Button)`
  padding: 50px;
  background-color: #ffc107;
  border: 3px solid black;
`;

export const Stage = (props) => {
  const [blanket, setBlanket] = useState(null);
  const submitValidation = () => {
    if (props.titleValue.length >= TITLE_LENGTH_LIMIT) {
      setBlanket(
        <ErrorArray
          header="Title Too Long"
          message={[
            `Gallery title must be less than ${TITLE_LENGTH_LIMIT} characters ` +
              `long. Your title is currently ${props.titleValue.length} ` +
              `characters long.`,
          ]}
          onOk={() => setBlanket(null)}
        />
      );
    } else {
      props.confirmCreate();
    }
  };
  return (
    <Div>
      {blanket}
      <Description>
        <H2>Your Staged Gallery</H2>
        <Div>
          <H3>Gallery Name:</H3>
          <Input
            data-testid="titleInput"
            placeholder="Name of your gallery here"
            value={props.titleValue}
            onChange={(e) => props.titleInput(e)}
          />{" "}
          <SizeLimitCounter
            length={props.titleValue.length}
            limit={TITLE_LENGTH_LIMIT}
            warnLimit={TITLE_LENGTH_LIMIT - 10}
            hideUntil={50}
          />
          <H3>Gallery Description:</H3>
          <P>
            You may use this default description, or change it to whatever you
            prefer.
          </P>
          <Textarea
            value={props.descriptionValue}
            onChange={(e) => props.descriptionInput(e)}
          />
          <H3>Staged Goups</H3>
          {props.groups.map((group) => (
            <StagedGroup
              key={group.join("") + Math.random().toString()}
              unstageGroupHandler={props.unstageGroupHandler}
              group={group}
            />
          ))}
        </Div>
        <LargeButton data-testid="submit" onClick={submitValidation}>
          <P>Create Gallery</P>
          <P>
            (Or, add another group by uploading another <code>.csv</code> file.)
          </P>
        </LargeButton>
      </Description>
    </Div>
  );
};

Stage.propTypes = {
  titleValue: PropTypes.string.isRequired,
  titleInput: PropTypes.func.isRequired,
  descriptionValue: PropTypes.string.isRequired,
  descriptionInput: PropTypes.func.isRequired,
  groups: PropTypes.array.isRequired,
  unstageGroupHandler: PropTypes.func.isRequired,
  confirmCreate: PropTypes.func.isRequired,
};
