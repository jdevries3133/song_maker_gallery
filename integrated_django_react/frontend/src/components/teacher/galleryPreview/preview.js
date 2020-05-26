import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import { cloneDeep } from "lodash";
import Header from "../../gallery/header/header";
import TileGrid from "../../gallery/tilegrid/tilegrid";

const preview = (props) => {
  // const process = cloneDeep(props.array);
  // const newArr = mutate(process);
  // console.log("cursed array", newArr);
  return <h1>temp</h1>;

  const [title, setTtile] = useState(props.title);
  const [description, setDescription] = useState(props.description);
  const [data, setArray] = useState(props.array);

  if (!data) {
    return <h1>Loading</h1>;
  }

  return (
    <Fragment>
      <Header title={title} description={description} />
      <TileGrid data={display} />
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    title: state.presentGallery.title,
    description: state.presentGallery.description,
    array: state.presentGallery.array,
  };
};

export default connect(mapStateToProps)(preview);
