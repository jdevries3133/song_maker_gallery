import React, { Fragment, useState } from "react";
import Header from "./header/header";
import TileGrid from "./tilegrid/tilegrid";
import Donate from "./donate/donate";
import DonateButton from "./donate/donate_button";

const galBody = (props) => {
  const [blanket, setBlanket] = useState(null);
  return (
    <Fragment>
      <Header
        title={props.title}
        description={props.description}
        data={props.data}
      />
      <div>
        {blanket}

        {props.data.map((group) => (
          <TileGrid data={group} key={group.slice(-1)[0]} />
        ))}
      </div>
      <DonateButton
        onClick={() => setBlanket(<Donate onClose={() => setBlanket(null)} />)}
      >
        $
      </DonateButton>
    </Fragment>
  );
};

export default galBody;
