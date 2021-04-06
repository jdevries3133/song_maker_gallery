import React from "react";
import PropTypes from "prop-types";

import { Layout } from "./layout";

export const ManageAccount = (props) => {
  return (
    <>
      <Layout {...props} />
    </>
  );
};

ManageAccount.propTypes = {
  changeEmail: PropTypes.func.isRequired,
  changePasswd: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
};
