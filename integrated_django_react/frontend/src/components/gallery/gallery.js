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
    if (this.props.gallery === undefined) {
      console.log("yes");
    }
    console.log("this", this.props);
    return (
      <div>
        {this.props.gallery === undefined ? (
          <h1>Loading</h1>
        ) : (
          <GalleryBody
            title={this.props.gallery.title}
            description={this.props.gallery.description}
            data={this.props.gallery.api_obj}
          />
        )}
      </div>
    );
  }
}

// const mapStateToProps = (state) => ({
//   gallery: state.galleries[0],
// });

function mapStateToProps(state) {
  console.log("get from ", state.galleries.galleries[0]);
  const gallery = state.galleries.galleries[0];
  console.log("gallery", gallery);
  return {
    gallery: gallery,
  };
}

export default connect(mapStateToProps, { getGallery })(gallery);
