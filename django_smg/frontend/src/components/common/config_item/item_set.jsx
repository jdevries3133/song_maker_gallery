import React from "react";

/**
 * HOC where the all <ConfigItem /> children are dependent on the first.
 * If the first is disabled, all children will be disabled as well.
 */
export const ConfigItemSet = ({ children }) => {
  let childrenEnabled;
  return (
    <>
      {React.Children.map(children, (child, i) => {
        if (i === 0) {
          childrenEnabled = child.props.checked;
          return child;
        }
        if (childrenEnabled) {
          return child;
        }
        return null;
      })}
    </>
  );
};
