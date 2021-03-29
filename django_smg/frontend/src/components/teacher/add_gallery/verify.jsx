import React, { useState, useEffect } from "react";

import styled, {
  Input,
  H2,
  H3,
  Blanket,
  Button,
  P,
  Div,
  css,
} from "../../common/styles";

import { StagedGroupBody } from "./snippets";

// CSS will scale for group names up to this length.
const GROUP_NAME_LENGTH_LIMIT = 15;

const Table = styled.table`
  text-align: center;
  margin: auto;
`;

// TODO: this is not working
const StyledLimitCounter = styled.span`
  padding-left: "10px",
    ${(props) =>
        props.length < props.hideUntil &&
        css`
          display: none;
        `}
      ${(props) =>
        props.length > props.warnLimit &&
        css`
          color: orange;
        `}
      ${(props) =>
        props.length > props.limit &&
        css`
          color: "#e41000";
        `};
`;

export const SizeLimitCounter = (props) => {
  return (
    <StyledLimitCounter data-testid="titleLenLimit" {...props}>
      {props.length}/{props.limit}
    </StyledLimitCounter>
  );
};

const getColIndicies = (headers) => {
  let nameIndex;
  let linkIndex;
  for (let i = 0; i < headers.length; i++) {
    if (headers[i].toLowerCase().includes("name")) {
      nameIndex = i;
    } else if (headers[i].toLowerCase().includes("link")) {
      linkIndex = i;
    }
    if (nameIndex && linkIndex) break;
  }
  return {
    nameIndex,
    linkIndex,
  };
};

/**
 * Filter the full spreadsheet to the two user-selected columns.
 */
const filterData = (data, nameIndex, linkIndex) => {
  if (typeof nameIndex === "number" && typeof linkIndex === "number") {
    return data.filter((row) => {
      // handle csvs with blankline at the end of the file
      if (row.length < 2) {
        return null;
      }
      return [row[nameIndex], row[linkIndex]];
    });
  }
  return null;
};

const Verify = (props) => {
  const duplicateGroupName = props.otherGroups.includes(props.groupName);
  const groupNameTooBig = props.groupName?.length > GROUP_NAME_LENGTH_LIMIT;
  const isFormError = duplicateGroupName || groupNameTooBig;

  const [nameIndex, setNameIndex] = useState("init");
  const [linkIndex, setLinkIndex] = useState("init");

  useEffect(() => {
    const { nameIndex: nameIndexTmp, linkIndex: linkIndexTmp } = getColIndicies(
      props.csv.data[0]
    );
    setNameIndex(nameIndexTmp);
    setLinkIndex(linkIndexTmp);
  }, []);

  const filtered = filterData(props.csv.data, nameIndex, linkIndex);

  if (nameIndex === undefined) {
    return (
      <Blanket data-testid="verifyModalNoName">
        <H2>Whoops!</H2>
        <P>
          It looks like your spreadsheet didn't have a header of "name," can you
          select the column that contains <b>names?</b>
        </P>
        {props.csv.data[0].map((row, index) => {
          return (
            <Button
              data-testid="nameColChoice"
              key={index}
              onClick={() => {
                setNameIndex(index);
              }}
            >
              {row}
            </Button>
          );
        })}
        <Button color="salmon" onClick={(e) => props.restart(e)}>
          Restart
        </Button>
      </Blanket>
    );
  } else if (linkIndex === undefined) {
    return (
      <Blanket data-testid="verifyModalNoLink">
        <H2>Whoops!</H2>
        <P>
          It looks like your spreadsheet didn't have a header of "link," can you
          select the column that contains <b>links?</b>
        </P>
        {props.csv.data[0].map((row, index) => (
          <Button
            data-testid="linkColChoice"
            key={index}
            onClick={() => setLinkIndex(index)}
          >
            {row}
          </Button>
        ))}
        <Button color="salmon" onClick={(e) => props.restart(e)}>
          Discard and Start Over
        </Button>
      </Blanket>
    );
  } else if (filtered !== null) {
    return (
      <Blanket data-testid="verifyModalNormal">
        <Div>
          <h2 style={{ backgroundColor: "#3432c761" }}>Does this look good?</h2>
          <h3>Group Name to Display:</h3>
          {duplicateGroupName ? <P warn>Duplicate group name.</P> : null}
          {groupNameTooBig ? <P warn>Group name too long.</P> : null}
          <Input
            value={props.groupName}
            onChange={(e) => props.groupNameChange(e)}
          />
          <SizeLimitCounter
            length={props.groupName?.length}
            limit={GROUP_NAME_LENGTH_LIMIT}
          />
        </Div>
        <Table>
          <thead>
            <tr>
              <td>Name</td>
              <td>Link</td>
            </tr>
          </thead>
          <tbody>
            <StagedGroupBody group={filtered.slice(1)} />
          </tbody>
        </Table>
        {duplicateGroupName ? (
          <H3 warn>
            Scroll up to change group name. Current group name is a duplicate.
          </H3>
        ) : null}
        {groupNameTooBig ? (
          <H3 warn>
            Scroll up to shorten group name. Group names must be less than{" "}
            {GROUP_NAME_LENGTH_LIMIT} characters long.
          </H3>
        ) : null}
        {!isFormError ? (
          <Button
            block
            data-testid="verifyGroupButton"
            onClick={() => props.validatedHandler(filtered)}
          >
            Add Group
          </Button>
        ) : null}
        <Button block color="salmon" onClick={(e) => props.restart(e)}>
          Discard and Start Over
        </Button>
      </Blanket>
    );
  } else {
    return (
      <Blanket>
        <H2>Oops!</H2>
        <P>
          It looks like your spreadsheet does not follow our template, because
          we were unable to parse the information you uploaded in order to
          provide a preview.
        </P>
        <P>
          Please download our template and make sure that your <code>.csv</code>{" "}
          file looks the same!
        </P>
        <Button color="salmon" onClick={(e) => props.restart(e)}>
          Try Again
        </Button>
      </Blanket>
    );
  }
};

/**
 * This is an unfortunate hack, but the extra wrapping div makes it possible
 * to know if this component has been mounted *at all* regardless of the
 * state it might be mounted in.
 *
 * This tagging would otherwise be repetitive because of all the conditional
 * rendering.
 */
const VerifyTestWrapper = (props) => (
  <Div data-testid="verifyModalPresent">
    <Verify {...props} />
  </Div>
);

export default VerifyTestWrapper;
