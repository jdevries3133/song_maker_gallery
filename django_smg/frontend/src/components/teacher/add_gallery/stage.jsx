import React, { useState } from "react";
import PropTypes from "prop-types";

import { StagedGroup } from "./snippets";
import { ErrorArray } from "../../common/custom_error";
import styled, { H2, H3, P, Input, Button, Div } from "../../common/styles";

import { SizeLimitCounter } from "./verify";

export const TITLE_LENGTH_LIMIT = 100;

const LargeButton = styled(Button)`
  padding: 50px;
  background-color: #ffc107;
  border: 3px solid black;
`;

const TextArea = styled.textarea`
  font-family: Helvetica, Arial, sans-serif;
  font-size: 19px;
  line-height: 1.5;
  margin: 0px;
  width: 85%;
  height: 263px;
  box-shadow: 1px 1px 1px #999;
  border: 1px solid #ccc;
  border-radius: 5px;
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
        <TextArea
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
