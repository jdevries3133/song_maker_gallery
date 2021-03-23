import React, { useState } from "react";
import PropTypes from "prop-types";
import { StagedGroup } from "./snippets";
import { ErrorArray } from "../../generics/custom_error";
import styles from "./add_gallery.module.css";

export const TITLE_LENGTH_LIMIT = 100;

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
    <div>
      {blanket}
      <h2>Your Staged Gallery</h2>
      <br />
      <div>
        <h3>Gallery Name:</h3>
        <input
          data-testid="titleInput"
          className={styles.wide_input}
          placeholder="Name of your gallery here"
          value={props.titleValue}
          onChange={(e) => props.titleInput(e)}
        />{" "}
        {props.titleValue.length >= 50 ? (
          <span
            style={
              props.titleValue.length >= TITLE_LENGTH_LIMIT
                ? { color: "red" }
                : props.titleValue.length >= TITLE_LENGTH_LIMIT - 10
                ? { color: "orange" }
                : null
            }
            data-testid="titleLenLimit"
          >
            {props.titleValue.length}/{TITLE_LENGTH_LIMIT}
          </span>
        ) : null}
        <h3>Gallery Description:</h3>
        <p>
          You may use this default description, or change it to whatever you
          prefer.
        </p>
        <textarea
          className={styles.desc_input}
          value={props.descriptionValue}
          onChange={(e) => props.descriptionInput(e)}
        />
        <h3>Staged Goups</h3>
        {props.groups.map((group) => (
          <StagedGroup
            key={group.join("") + Math.random().toString()}
            unStageGroupHandler={props.unStageGroupHandler}
            group={group}
          />
        ))}
      </div>
      <br />
      <button
        data-testid="submit"
        className={styles.large_button}
        onClick={submitValidation}
      >
        <p>Create Gallery</p>
        <p>
          (Or, add another group by uploading another <code>.csv</code> file.)
        </p>
      </button>
    </div>
  );
};

Stage.propTypes = {
  titleValue: PropTypes.string.isRequired,
  titleInput: PropTypes.func.isRequired,
  descriptionValue: PropTypes.string.isRequired,
  descriptionInput: PropTypes.func.isRequired,
  groups: PropTypes.array.isRequired,
  unStageGroupHandler: PropTypes.func.isRequired,
  confirmCreate: PropTypes.func.isRequired,
};
