import React, { useState } from "react";
import StagedGroup from "./staged_group";

const staged = (props) => {
  return (
    <div>
      <h2>Your Staged Gallery</h2>
      <br />
      <div className="description">
        <h3>Gallery Name:</h3>
        <input />
        <table>
          <thead>
            <tr>
              <td>Staged Groups</td>
            </tr>
          </thead>
          <tbody>
            {props.groups.map((group) => (
              <StagedGroup
                unStageGroupHandler={props.unStageGroupHandler}
                group={group}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default staged;
