import React, { useState, useEffect } from "react";
import styles from "./add_gallery.module.css";

import { StagedGroupBody } from "./snippets";

// CSS will scale for group names up to this length.
const GROUP_NAME_LENGTH_LIMIT = 15;

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
  const groupNameTooBig = props.groupName.length > GROUP_NAME_LENGTH_LIMIT;
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
      <div
        data-testid="verifyModalNoName"
        className={`description blanket ${styles.scroll_blanket}`}
      >
        <h2>Whoops!</h2>
        <p>
          It looks like your spreadsheet didn't have a header of "name," can you
          select the column that contains <b>names?</b>
        </p>
        {props.csv.data[0].map((row, index) => {
          return (
            <button
              data-testid="nameColChoice"
              key={index}
              onClick={() => {
                setNameIndex(index);
              }}
            >
              {row}
            </button>
          );
        })}
        <button
          onClick={(e) => props.restart(e)}
          className={`button ${styles.restart_btn}`}
        >
          Restart
        </button>
      </div>
    );
  } else if (linkIndex === undefined) {
    return (
      <div
        data-testid="verifyModalNoLink"
        className={`description blanket ${styles.scroll_blanket}`}
      >
        <h2>Whoops!</h2>
        <p>
          It looks like your spreadsheet didn't have a header of "link," can you
          select the column that contains <b>links?</b>
        </p>
        {props.csv.data[0].map((row, index) => (
          <button
            data-testid="linkColChoice"
            key={index}
            onClick={() => setLinkIndex(index)}
          >
            {row}
          </button>
        ))}
        <button
          onClick={(e) => props.restart(e)}
          className={`button ${styles.restart_btn}`}
        >
          Discard and Start Over
        </button>
      </div>
    );
  } else if (filtered !== null) {
    return (
      <div
        data-testid="verifyModalNormal"
        className={`description blanket ${styles.scroll_blanket}`}
      >
        <h2 className={styles.doesThisLookGood}>Does this look good?</h2>
        <h3>Group Name to Display:</h3>
        {duplicateGroupName ? (
          <p style={{ color: "red" }}>Duplicate group name.</p>
        ) : null}
        {groupNameTooBig ? (
          <p style={{ color: "red" }}>Group name too long.</p>
        ) : null}
        <input
          className={`${styles.input} ${styles.wide_input}`}
          value={props.groupName}
          onChange={(e) => props.groupNameChange(e)}
        />
        <span
          style={{
            paddingLeft: "10px",
            ...(groupNameTooBig ? { color: "red" } : {}),
          }}
        >
          {props.groupName.length}/{GROUP_NAME_LENGTH_LIMIT}
        </span>
        <br />
        <table className={styles.blanket_table}>
          <thead>
            <tr>
              <td>Name</td>
              <td>Link</td>
            </tr>
          </thead>
          <tbody>
            <StagedGroupBody group={filtered.slice(1)} />
          </tbody>
        </table>
        {duplicateGroupName ? (
          <h3 style={{ color: "red" }}>
            Scroll up to change group name. Current group name is a duplicate.
          </h3>
        ) : null}
        {groupNameTooBig ? (
          <h3 style={{ color: "red" }}>
            Scroll up to shorten group name. Group names must be less than{" "}
            {GROUP_NAME_LENGTH_LIMIT} characters long.
          </h3>
        ) : null}
        {!isFormError ? (
          <button
            data-testid="verifyGroupButton"
            onClick={() => props.validatedHandler(filtered)}
            className={`button ${styles.up_btn}`}
          >
            Add Group
          </button>
        ) : null}
        <button
          onClick={(e) => props.restart(e)}
          className={`button ${styles.restart_btn}`}
        >
          Discard and Start Over
        </button>
      </div>
    );
  } else {
    return (
      <div className={`description blanket ${styles.scroll_blanket}`}>
        <h2>Oops!</h2>
        <p>
          It looks like your spreadsheet does not follow our template, because
          we were unable to parse the information you uploaded in order to
          provide a preview.
        </p>
        <p>
          Please download our template and make sure that your <code>.csv</code>{" "}
          file looks the same!
        </p>
        <button
          onClick={(e) => props.restart(e)}
          className={`button ${styles.restart_btn}`}
        >
          Try Again
        </button>
      </div>
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
  <div data-testid="verifyModalPresent">
    <Verify {...props} />
  </div>
);

export default VerifyTestWrapper;
