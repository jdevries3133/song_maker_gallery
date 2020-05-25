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
              <td align="center">Staged Groups</td>
            </tr>
          </thead>
          <tbody>
            {props.groups.map((group) => (
              <StagedGroup
                key={group.join("").slice(0, 20)}
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
