import React, { Fragment, useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import Button from "../../generics/button";
import ConfirmDelete from "./confirm_delete";
import ServerError from "../../generics/server_error";
import {
  postGallery,
  deleteGallery,
  acknowledgeDelete,
  getUserGalleries,
} from "../../../actions/user";

const ListGalleries = (props) => {
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [blanket, setBlanket] = useState(null);

  let user_gals;
  const onOk = () => {
    setBlanket(null);
    setConfirmDelete(null);
    props.acknowledgeDelete();
  };

  useEffect(() => {
    if (props.deleteStatus === "deleted") {
      props.getUserGalleries(props.token);
      setBlanket(
        <div className="description blanket">
          <h2>Success</h2>
          <p>Your gallery has been deleted.</p>
          <button onClick={() => onOk()}>Ok</button>
        </div>
      );
    } else if (props.deleteStatus === "error") {
      setBlanket(<ServerError onOk={onOk} />);
    }
  }, [props.deleteLoopback]);

  const deleteConfirmed = (pk) => {
    props.deleteGallery(pk, props.token);
  };

  if (props.galleries) {
    user_gals = props.galleries.map((gallery, index) => {
      const url = `${window.location.href.slice(0, -7)}gallery/${
        gallery["slug"]
      }/`;
      return (
        <ThemeProvider
          theme={{
            color: "black",
            resizeThreshold: "1170px",
          }}
          key={index}
        >
          <tr className={styles.shaded_tr}>
            <td width="30%">
              {gallery["title"].slice(0, 14)}
              {gallery["title"].length < 14 ? null : <span>...</span>}
            </td>
            <td width="70%">
              <Link to={`/gallery/${gallery["slug"]}/`}>
                <ThemeProvider
                  theme={(theme) => {
                    return { backgroundColor: "#00c4ff", ...theme };
                  }}
                >
                  <Button>View</Button>
                </ThemeProvider>
              </Link>
              <ThemeProvider theme={{ backgroundColor: "#fa8071" }}>
                <Button
                  onClick={() =>
                    setConfirmDelete(
                      <ConfirmDelete
                        url={url}
                        pk={gallery["pk"]}
                        confirmation={deleteConfirmed}
                      />
                    )
                  }
                >
                  Delete
                </Button>
              </ThemeProvider>
            </td>
          </tr>
        </ThemeProvider>
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
              <td>
                <h3 style={{ fontWeight: 400 }}>
                  Your galleries will go here some day.
                </h3>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Fragment>
  );
};

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
    deleteLoopback: state.user.loopback,
    deleteStatus: state.user.deleteStatus,
  };
};

export default connect(mapStateToProps, {
  deleteGallery,
  getUserGalleries,
  postGallery,
  acknowledgeDelete,
})(ListGalleries);
