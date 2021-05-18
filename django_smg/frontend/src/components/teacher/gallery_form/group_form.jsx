import React, { useState } from "react";

import styled, { Description, Form, Input, Label } from "Styles";

import { DraggableTile } from "./draggable_tile";

const TileContainer = styled.div`
  margin-top: 2rem;
  display: grid;
  grid-gap: 2vw;
  grid-template-rows: mix-content;
  align-content: stretch;

  @media (min-width: 720px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1150px) {
  grid-template-columns: repeat(3, 1fr);
`;

export const GroupForm = ({ group }) => {
  const [groupStudents, setGroupStudents] = useState(group.songs);

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
    <Description>
      <Form>
        <Label htmlFor="group name">Group Name</Label>
        <Input type="text" id="group name" defaultValue={group.group_name} />
      </Form>
      <TileContainer>
        {groupStudents.map((song, i) => (
          <DraggableTile
            key={i + song.songId + Math.random()}
            name={song.student_name}
            songId={song.songId}
            groupName={group.group_name}
            swap={swap}
            index={i}
          />
        ))}
      </TileContainer>
    </Description>
  );
};
