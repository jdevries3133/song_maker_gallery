import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import Gallery from "../../gallery/gal_body";

const preview = (props) => {
  const [title, setTtile] = useState(props.title);
  const [description, setDescription] = useState(props.description);
  const [data, setArray] = useState(props.array);
  return (
    <Fragment>
      <Gallery title={title} description={description} data={data} />
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    title: state.title,
    description: state.description,
    array: state.array,
  };
};

export default connect(mapStateToProps)(preview);
