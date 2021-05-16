import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

const private_route = ({ children, isAuthenticated, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(args) => {
        return isAuthenticated ? (
          children
        ) : (
          <Redirect to={`/login?next=${args.location.pathname}`} />
        );
      }}
    />
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(private_route);
