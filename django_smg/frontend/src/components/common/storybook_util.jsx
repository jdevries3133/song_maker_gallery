import React, { useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

import { P } from "Styles";

// TODO: this should live in this file. See #70
export { Context } from "../../test/app_context";

export const BackendDependentStory = ({ backendPort = 8000, children }) => {
  axios.defaults.baseURL = `http://localhost:${backendPort}/`;
  useEffect(() => {
    console.warn(
      "Did the storybook blow up? Beware: you are viewing a story that is " +
        "depending on the backend being up, running, and potentially " +
        "initialized with some database data!"
    );
  }, []);
  return (
    <>
      <P warn>
        Warning! This component is dependent on the backend. Ensure that the
        backend is running on localhost:{backendPort}, and check the code for
        this specific story to see if the database should be initialized with
        test data!
      </P>
      {children}
    </>
  );
};

BackendDependentStory.propTypes = {
  /* The port axios will go to, and that the warning message will specify */
  backendPort: PropTypes.number,
};
