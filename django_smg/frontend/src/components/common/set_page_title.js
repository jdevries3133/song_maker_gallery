import React from "react";

export const Title = ({ is, children }) => {
  useEffect(() => {
    window.title = is;
  }, []);
  return children;
};
