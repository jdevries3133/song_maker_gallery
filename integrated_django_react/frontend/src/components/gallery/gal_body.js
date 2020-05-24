import React from "react";
import Header from "./header/header";
import TileGrid from "./tilegrid/tilegrid";

const galBody = (props) => {
  <Header title={props.title} description={props.description} />;

  {
    props.data.map((group) => (
      <TileGrid data={group} key={group.slice(-1)[0]} />
    ));
  }
};

export default galBody;
