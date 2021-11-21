import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import Loading from "Common/loading";
import GalleryBody from "./gal_body";
import { getGallery } from "Actions/gallery";
import { windowLocation } from "../../util/window";
import { Description, FlexContainer } from "Common/styles";

class Gallery extends Component {
  state = {
    slug: windowLocation("pathname").split("/")[2] || "",
    gallery: null,
  };

  componentDidMount() {
    this.props.getGallery(this.state.slug);
  }
  componentDidUpdate() {
    document.title = this.props?.gallery?.title || document.title;
  }

  render() {
    if (this.props.status === 404) {
      return (
        <div>
          <h1>Gallery Does Not Exist</h1>
          <h2>There is no gallery named {this.state.slug.replace("-", " ")}</h2>
        </div>
      );
    }

    if (!this.props?.gallery?.is_public) {
      return (
        <FlexContainer>
          <Description>
            <h1>Gallery is Private</h1>
            {this.props.gallery?.is_editable && (
              <p>
                But your teacher is still allowing students to submit songs!{" "}
                <Link to={`/gallery/${this.state.slug}/submit-song/`}>
                  Click here to add your song to the growing gallery!
                </Link>
              </p>
            )}
          </Description>
        </FlexContainer>
      );
    }
    if (
      // no gallery has been loaded yet
      this.props.status === undefined ||
      // the gallery in the redux state is not the gallery currently being
      // navigated to
      (this.props.gallery && this.props.gallery.slug !== this.state.slug)
    ) {
      return <Loading dark />;
    }

    return (
      <div data-testid="mounted gallery body">
        <GalleryBody
          title={this.props.gallery.title}
          description={this.props.gallery.description}
          data={this.props.gallery}
          button={this.state.button}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    gallery: state.gallery.gallery,
    status: state.gallery.status,
  };
}

export default connect(mapStateToProps, { getGallery })(Gallery);
