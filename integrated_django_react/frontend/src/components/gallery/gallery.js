import React, { Fragment, Component } from "react";

import GalleryBody from "./gal_body";

import { getGallery } from "../../actions/galleries";
import { connect } from "react-redux";

class gallery extends Component {
  state = {
    url_ext: window.location.pathname.split("/")[2],
    gallery: null,
  };

  componentDidMount() {
    console.log("ran");
    this.props.getGallery(this.state.url_ext);
  }

  render() {
    console.log(this);
    return <div>{this.state.gallery ? <h1>Loading</h1> : <p>none</p>}</div>;
  }
}

const mapStateToProps = (state) => ({
  gallery: state.galleries[0],
});

export default connect(mapStateToProps, { getGallery })(gallery);
