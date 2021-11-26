import React from "react";
import { useDrag, useDrop } from "react-dnd";

import styled from "styled-components";
import useWidth from "Common/useWidth";
import { EditableTile } from "Common/song_tiles/editable_tile";

import { SwapHint, BadDragHint } from "./hints";

const Div = styled.div`
  position: relative;
  margin: 0;
  padding: 0;
`;

const Controllers = styled.div`
  top: min(-12px, -3vw);
  left: 0;
  position: absolute;
  text-align: left;
`;

const Tooltip = styled.span`
  opacity: 0%;
  margin: 2.5vw 0 0 5px;
  background-color: hsl(43deg 87% 52%);
  border-radius: 10px;
  padding: 5px;
  transition: 0.3s ease;
`;

const Handle = styled.div`
  display: inline-block;
  margin: 2.5vw 0 0 -0.5vw;
  box-shadow: 0px 3px 8px rgb(100, 100, 100);
  background-color: hsl(43deg 87% 52%);
  height: 20px;
  width: 20px;
  border-radius: 100%;

  &:hover + ${Tooltip} {
    opacity: 100%;
  }
`;

export const DraggableTile = ({ song, groupName, swap, index }) => {
  const { width } = useWidth(450);
  const [_, drag, dragPreview] = useDrag(() => ({
    type: "formGroup",
    item: {
      index,
      group: groupName,
      song: song.songId,
    },
  }));

  const [{ isOver, item }, drop] = useDrop(() => ({
    accept: "formGroup",
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      item: monitor.getItem(),
    }),
    drop: (i) => {
      if (i.group == groupName) {
        swap(index, i.index);
      }
    },
  }));

  return (
    <Div data-testid="drop target" ref={drop}>
      <Div ref={dragPreview}>
        {/* The drag ref marks this node as being the "pick-up" node */}
        {width > 450 && (
          <Controllers>
            <Handle role="Handle" ref={drag} />
            <Tooltip>Drag and Drop</Tooltip>
          </Controllers>
        )}
        {isOver ? (
          item.group == groupName ? (
            <SwapHint />
          ) : (
            // you cannot drag from one group to another
            <BadDragHint />
          )
        ) : (
          <EditableTile
            name={song.student_name}
            link={
              `https://musiclab.chromeexperiments.com` +
              `/Song-Maker/song/${song.songId}`
            }
            initialSong={song}
          />
        )}
      </Div>
    </Div>
  );
};
