import React, { Fragment, Component } from "react";

import Header from "./header/header";
import TileGrid from "./tilegrid/tilegrid";

import PropTypes from "prop-types";
import { getGallery } from "../../actions/galleries";
import { connect } from "react-redux";

class Gallery extends Component {
  state = {
    title: "",
    description: "",
    data: [],
    gallery: {},
  };
  componentDidMount() {
    const url_ext = window.location.pathname.split("/")[2];
    this.props.getGallery(url_ext);
  }
  handle(e) {
    console.log(e);
    this.setState({
      s: e.target.value,
    });
  }
  galleryBody() {
    <Header title={this.state.title} description={this.state.description} />;
    {
      this.state.data.map((group) => (
        <TileGrid data={group} key={group.slice(-1)[0]} />
      ));
    }
  }
  render() {
    console.log(this.state.gallery);
    return (
      <div>
        {this.state.gallery === {} ? <h1>t</h1> : <h1>f</h1>}
        <input onChange={(e) => this.handle(e)} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  gallery: state.galleries[0],
});

export default connect(mapStateToProps, { getGallery })(Gallery);
