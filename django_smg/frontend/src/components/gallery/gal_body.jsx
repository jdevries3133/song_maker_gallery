import React from "react";

import { Div } from "../common/styles";

import { Donate } from "./donate";
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
        {props.data.map((group) => (
          <TileGrid data={group} key={group.slice(-1)[0]} />
        ))}
      </Div>
      <Donate />
    </>
  );
};

export default galBody;
