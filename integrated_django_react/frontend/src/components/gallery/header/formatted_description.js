import React, { Fragment } from "react";

const formatted_description = (props) => {
  // If there is a description, break it by newlines and separate by p tags.
  // Otherwise, render the default description.

  if (props.desc_str) {
    const arr = props.desc_str.split("\n");
    return arr.map((par, index) => <p key={index}>{par}</p>);
  } else {
    return (
      <Fragment>
        <p>
          We will always find a way to share music. In lieu of the concert hall,
          our musical performances today are expressed in ones and zeroes, but
          they are none the less as human and as meaningful as always.
        </p>
        <p>
          Please enjoy this showcase of our school's music lab compositions. Our
          students' creativity truly knows no bounds
        </p>
      </Fragment>
    );
  }
};

export default formatted_description;
