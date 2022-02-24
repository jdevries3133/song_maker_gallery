import React from "react";

// TODO: factor out depricated use of low-level blanket ("modal")
import { StyledBlanket as Blanket } from "Common/blanket/styled_blanket";

import styled, { Div, H2, H3, Input, Button } from "Styles";

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

export const MissingFields = (props) => {
  return (
    <Blanket>
      {props.blankTitleError ? (
        <Div>
          <H2>Missing Fields</H2>
          <H3>Please enter a title for your gallery.</H3>
          <Input onChange={(e) => props.titleInputHandler(e)} />
        </Div>
      ) : null}
      {props.blankDescriptionError ? (
        <Div>
          <H3>Please enter a description for your gallery</H3>
          <TextArea
            value={props.descriptionValue}
            onChange={(e) => props.descriptionInputHandler(e)}
          />
        </Div>
      ) : null}

      {props?.titleValue?.trim() && props?.descriptionValue?.trim() ? (
        <Div>
          <Button onClick={() => props.dismissTitleBlank()}>Continue</Button>
        </Div>
      ) : null}
    </Blanket>
  );
};
