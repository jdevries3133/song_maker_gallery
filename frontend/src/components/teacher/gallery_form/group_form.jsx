import React, { useState } from "react";
import { connect } from "react-redux";
import axios from "axios";

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

const _GroupForm = ({ group: inputGrp, token }) => {
  const [group, setGroup] = useState(inputGrp);
  const groupStudents = group.songs;

  /**
   * Swaps the position of two students in the group
   */
  const swap = (index1, index2) => {
    groupStudents[index1].order = index2;
    groupStudents[index2].order = index1;

    axios.defaults.xsrfCookieName = "csrftoken";
    axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios
      .patch(`/api/gallery/song_group/${group.pk}/`, group, {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => {
        setGroup(res.data);
      })
      .catch((e) => console.error(e));
  };

  return (
    <Description>
      <Form>
        <Label htmlFor="group name">Group Name</Label>
        <Input type="text" id="group name" defaultValue={group.group_name} />
      </Form>
      <TileContainer>
        {groupStudents &&
          groupStudents.map((song, i) => (
            <DraggableTile
              key={i + song.songId + Math.random()}
              song={song}
              groupName={group.group_name}
              swap={swap}
              index={i}
            />
          ))}
      </TileContainer>
    </Description>
  );
};

const mapStateToProps = (state) => ({
  token: state.auth.token,
});

export const GroupForm = connect(mapStateToProps)(_GroupForm);
