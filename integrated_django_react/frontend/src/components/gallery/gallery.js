import React, { Fragment, Component } from "react";

import GalleryBody from "./gal_body";

import { getGallery } from "../../actions/gallery";
import { connect } from "react-redux";

class gallery extends Component {
  state = {
    url_ext: window.location.pathname.split("/")[2],
    gallery: null,
  };

  componentDidMount() {
    this.props.getGallery(this.state.url_ext);
  }

  render() {
    // return <h1>temp</h1>;
    if (this.props.status === undefined) {
      return <h1>Loading</h1>;
    } else if (this.state.url_ext === "") {
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
              There is no gallery named {this.state.url_ext.replace("-", " ")}
            </h2>
          </div>
        );
      } else {
        return (
          <div>
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
  }
}

function mapStateToProps(state) {
  return {
    gallery: state.gallery.gallery,
    status: state.gallery.status,
  };
}

export default connect(mapStateToProps, { getGallery })(gallery);
