import React from "react";
import { Link } from "react-router-dom";
import StagedGroup from "./staged_group";
import styles from "./add_gallery.module.css";

const staged = (props) => {
  return (
    <div>
      <h2>Your Staged Groups</h2>
      <br />
      <div className="description">
        <h3>Gallery Name:</h3>
        <input
          className={styles.wide_input}
          placeholder="Name of your gallery here"
          value={props.titleValue}
          onChange={(e) => props.titleInput(e)}
        />
        <table>
          <thead>
            <tr>
              <td align="center">Staged Groups</td>
            </tr>
          </thead>
          <tbody>
            {props.groups.map((group) => (
              <StagedGroup
                key={group.join("") + Math.random().toString()}
                unStageGroupHandler={props.unStageGroupHandler}
                group={group}
              />
            ))}
          </tbody>
        </table>
      </div>
      <br />
      <Link to={{ pathname: "/gallery-preview" }}>
        <button
          className={styles.large_button}
          onClick={() => props.previewGallery()}
        >
          <p>Preview Gallery</p>
          <p>(Once all your groups are staged)</p>
        </button>
      </Link>
    </div>
  );
};

export default staged;
