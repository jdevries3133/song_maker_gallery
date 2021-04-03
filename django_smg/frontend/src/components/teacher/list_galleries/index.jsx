export { ListGalleries } from "./list_galleries";

/**
 * Redux connection
 */
import {
  postGallery,
  deleteGallery,
  acknowledgeDelete,
  getUserGalleries,
} from "Actions/user";
import { connect } from "react-redux";

import { ListGalleries } from "./list_galleries";

const mapStateToProps = (state) => {
  return {
    galleries: state.user.galleries.map((gallery) => {
      return {
        title: gallery["title"],
        slug: gallery["slug"],
        pk: gallery["pk"],
      };
    }),
    token: state.auth.token,
    deleteStatus: state.user.deleteStatus,
  };
};

export default connect(mapStateToProps, {
  deleteGallery,
  getUserGalleries,
  postGallery,
  acknowledgeDelete,
})(ListGalleries);
