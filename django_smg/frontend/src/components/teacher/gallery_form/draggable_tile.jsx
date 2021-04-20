import React from "react";
import { useDrag, useDrop } from "react-dnd";

import styled from "styled-components";
import { EditableTile } from "Common/song_tiles/editable_tile";

import { SwapHint } from "./swap_hint";

const Div = styled.div`
  margin: 0;
  padding: 0;
`;

const Tooltip = styled.span`
  opacity: 0;
  float: left;
  margin-top: 2.5vw;
  margin-left: 5px;
  background-color: hsl(43deg 87% 52%);
  border-radius: 10px;
  padding: 5px;
  transition: 0.3s ease;
`;

const Handle = styled.div`
  float: left;
  margin: 2.5vw 0 0 2.5vw;
  box-shadow: 0px 3px 8px rgb(100, 100, 100);
  background-color: hsl(43deg 87% 52%);
  height: 20px;
  width: 20px;
  border-radius: 100%;

  &:hover + ${Tooltip} {
    opacity: 100;
  }
`;

export const DraggableTile = ({ name, songId, groupName, swap, index }) => {
  const [_, drag, dragPreview] = useDrag(() => ({
    type: "formGroup",
    item: {
      index,
      group: groupName,
      song: songId,
    },
  }));

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "formGroup",
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
    drop: (i) => {
      swap(index, i.index);
    },
  }));

  return (
    <Div ref={drop}>
      <Div ref={dragPreview}>
        {/* The drag ref marks this node as being the "pick-up" node */}
        <Handle role="Handle" ref={drag} />
        <Tooltip>Drag and Drop</Tooltip>

        {isOver ? (
          <SwapHint />
        ) : (
          <EditableTile
            name={name}
            link={
              `https://musiclab.chromeexperiments.com` +
              `/Song-Maker/song/${songId}`
            }
          />
        )}
      </Div>
    </Div>
  );
};
