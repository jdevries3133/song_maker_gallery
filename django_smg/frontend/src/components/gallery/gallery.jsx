import React, { Component } from "react";

import Loading from "../generics/loading";
import GalleryBody from "./gal_body";

import { getGallery } from "../../actions/gallery";
import { connect } from "react-redux";

class gallery extends Component {
  state = {
    slug: window.location.pathname.split("/")[2],
    gallery: null,
  };
  componentDidMount() {
    this.props.getGallery(this.state.slug);
  }

  render() {
    if (
      // no gallery has been loaded yet
      this.props.status === undefined ||
      // the gallery in the redux state is not the gallery currently being
      // navigated to
      (this.props.gallery && this.props.gallery.slug !== this.state.slug)
    ) {
      return <Loading />;
    } else if (this.state.slug === "") {
      return (
        <div>
          <h1>Invalid Gallery URL!</h1>
        </div>
      );
    } else {
      if (this.props.status != 200) {
        return (
          <div>
            <h1>Gallery Does Not Exist</h1>
            <h2>
              There is no gallery named {this.state.slug.replace("-", " ")}
            </h2>
          </div>
        );
      } else {
        return (
          <div>
            <GalleryBody
              title={this.props.gallery.title}
              description={this.props.gallery.description}
              data={this.props.gallery.songData}
              button={this.state.button}
            />
          </div>
        );
      }
    }
  }
}

function mapStateToProps(state) {
  return {
    gallery: state.gallery.gallery,
    status: state.gallery.status,
  };
}

export default connect(mapStateToProps, { getGallery })(gallery);
