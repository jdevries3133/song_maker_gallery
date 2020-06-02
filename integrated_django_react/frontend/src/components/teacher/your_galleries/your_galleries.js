import React, { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import styles from "./your_galleries.module.css";
import ConfirmDelete from "./confirm_delete";
import ServerError from "../../generics/server_error";
import {
  postGallery,
  deleteGallery,
  getUserGalleries,
} from "../../../actions/user";
import { Link } from "react-router-dom";

const YourGalleries = (props) => {
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [blanket, setBlanket] = useState(null);
  let user_gals;

  const onOk = () => {
    setBlanket(null);
    setConfirmDelete(null);
  };

  const undo = (loopback) => {
    postGallery(
      {
        title: loopback.title,
        description: loopback.description,
        api_obj: loopback.api_obj,
      },
      props.token
    );
  };

  useEffect(() => {
    if (props.deleteStatus === "deleted") {
      props.getUserGalleries(props.token);
      setBlanket(
        <div className="description blanket">
          <h2>Success</h2>
          <p>Your gallery "{props.deleteLoopback.title}" has been deleted.</p>
          <button onClick={() => onOk()}>Ok</button>
          {/* <button onClick={() => undo(props.deleteLoopback)}>Undo</button> */}
          {/* will be a nice thing to implement later */}
        </div>
      );
    } else if (props.deleteStatus === "error") {
      setBlanket(<ServerError onOk={onOk} />);
    }
  }, [props.deleteLoopback]);

  const deleteConfirmed = (url_extension) => {
    props.deleteGallery(url_extension, props.token);
  };

  if (props.galleries) {
    user_gals = props.galleries.map((gallery, index) => {
      const url = window.location.href.slice(0, -7) + "gallery/" + gallery[1];
      return (
        <tr key={index}>
          <td>
            {gallery[0].slice(0, 14)}
            {gallery[0].length < 14 ? null : <span>...</span>}
          </td>
          <td>
            <Link to={"/gallery/" + gallery[1]}>
              <button className={styles.view}>View</button>
            </Link>
            <button
              onClick={() =>
                setConfirmDelete(
                  <ConfirmDelete
                    url={url}
                    extension={gallery[1]}
                    confirmation={deleteConfirmed}
                  />
                )
              }
              className={styles.delete}
            >
              Delete
            </button>
          </td>
        </tr>
      );
    });
  }

  return (
    <Fragment>
      {confirmDelete}
      {blanket}
      <h3>Your Galleries</h3>
      <table className={styles.outerTable}>
        <tbody>
          {user_gals.length !== 0 ? (
            user_gals
          ) : (
            <tr>
              <td colSpan="2">Your galleries will go here some day</td>
            </tr>
          )}
        </tbody>
      </table>
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    galleries: state.user.galleries.map((gallery) => [
      gallery["title"],
      gallery["url_extension"],
    ]),
    token: state.auth.token,
    deleteLoopback: state.user.loopback,
    deleteStatus: state.user.deleteStatus,
  };
};

export default connect(mapStateToProps, {
  deleteGallery,
  getUserGalleries,
  postGallery,
})(YourGalleries);
