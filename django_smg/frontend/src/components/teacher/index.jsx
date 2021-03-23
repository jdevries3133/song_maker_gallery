import React, { useEffect } from "react";
import { connect } from "react-redux";

import { logout } from "../../actions/auth.action";

import styles from "./add_gallery/file_upload_form.module.css";
import AddGallery from "./add_gallery";
import ListGalleries from "./list_galleries";

const TeacherHeader = ({ logout, token }) => {
  return (
    <div>
      <h1 className={styles.h1}>Gallery Management Console</h1>
      <button
        data-testid="logoutButton"
        className={styles.logout}
        onClick={() => {
          logout(token);
        }}
      >
        Log Out
      </button>
    </div>
  );
};

const Teacher = ({ title, token, logout }) => {
  useEffect(() => {
    document.title = title;
  }, []);
  return (
    <div>
      <TeacherHeader logout={logout} token={token} />
      <AddGallery />
      <ListGalleries />
    </div>
  );
};

export default connect(
  (s) => {
    return { token: s.auth.token };
  },
  { logout: logout }
)(Teacher);
