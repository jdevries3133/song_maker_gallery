import { useEffect } from "react";

export const Title = ({ is, children }) => {
  useEffect(() => {
    document.title = is;
  }, []);
  return children;
};
