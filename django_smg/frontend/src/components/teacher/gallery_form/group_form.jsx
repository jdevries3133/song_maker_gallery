import React, { useState } from "react";

import { DraggableTile } from "./draggable_tile";

import styled, { Form, Input, Label } from "Styles";

const TileContainer = styled.div`
  @media (min-width: 500px) {
    display: flex;
    flex-wrap: wrap;
  }
`;

export const GroupForm = ({ group }) => {
  const [groupName, setGroupName] = useState(group.slice(-1)[0]);
  const [groupStudents, setGroupStudents] = useState(group.slice(0, -1));

  /**
   * Swaps the position of two students in the group
   */
  const swap = (index1, index2) => {
    const tmp1 = groupStudents[index1];
    const tmp2 = groupStudents[index2];
    const newGroupStudents = [...groupStudents];
    newGroupStudents[index2] = tmp1;
    newGroupStudents[index1] = tmp2;
    setGroupStudents(newGroupStudents);
  };

  return (
    <div>
      <Form>
        <Label htmlFor="group name">Group Name</Label>
        <Input type="text" id="group name" defaultValue={groupName} />
      </Form>
      <TileContainer>
        {groupStudents.map((song, i) => (
          <DraggableTile
            key={i + song.songId}
            name={song.name}
            songId={song.songId}
            groupName={groupName}
            swap={swap}
            index={i}
          />
        ))}
      </TileContainer>
    </div>
  );
};
