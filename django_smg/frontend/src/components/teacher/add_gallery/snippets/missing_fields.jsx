import React from "react";

export const MissingFields = (props) => {
  return (
    <div className="description blanket">
      {props.blankTitleError ? (
        <>
          <h2>Missing Fields</h2>
          <h3 style={{ display: "block" }}>
            Please enter a title for your gallery.
          </h3>
          <input onChange={(e) => props.titleInputHandler(e)} />
        </>
      ) : null}
      {props.blankDescriptionError ? (
        <>
          <h3 style={{ display: "block" }}>
            Please enter a description for your gallery
          </h3>
          <textarea
            className={styles.desc_input}
            value={props.descriptionValue}
            onChange={(e) => props.descriptionInputHandler(e)}
          />
        </>
      ) : null}

      {props.titleValue.trim() && props.descriptionValue.trim() ? (
        <>
          <br />
          <button onClick={() => props.dismissTitleBlank()}>Continue</button>
        </>
      ) : null}
    </div>
  );
};
