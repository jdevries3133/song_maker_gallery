import React from "react";

import { Div } from "Styles";

import Header from "./header/header";
import { TileGrid } from "./tilegrid/tilegrid";

const galBody = (props) => {
  return (
    <>
      <Header
        title={props.title}
        description={props.description}
        data={props.data}
      />
      <Div>
        {props.data.song_groups.map((group) => (
          <TileGrid data={group} key={group.group_name + Math.random()} />
        ))}
      </Div>
    </>
  );
};

export default galBody;
