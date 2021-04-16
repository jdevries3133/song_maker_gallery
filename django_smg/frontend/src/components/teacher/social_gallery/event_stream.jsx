import React from "react";
import PropTypes from "prop-types";

import { Like, Heart, Star } from "Common/icon";

import { Comment } from "./comment";
import { Reaction } from "./reaction";

export const EventStream = ({ events, fetchMoreEvents }) => {
  return events.map((event, i) => {
    switch (event.type) {
      case "like":
        return <Reaction key={i} icon={<Like />} {...event} />;
      case "heart":
        return <Reaction key={i} icon={<Heart />} {...event} />;
      case "star":
        return <Reaction key={i} icon={<Star />} {...event} />;
      case "comment":
        return <Comment key={i} {...event} />;
      default:
        throw new Error("unsupported event type: ${event.type}");
    }
  });
};

EventStream.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(["like", "heart", "star", "comment"]),
      username: PropTypes.string,

      /* contains comment text if applicable */
      value: PropTypes.string,
      /* for comment pre-approval */
      isApproved: PropTypes.bool,

      /* same entity as the song passed to <DynamicTile /> */
      song: PropTypes.object,
    })
  ),

  /* callback for when user has scrolled close to the bottom */
  fetchMoreEvents: PropTypes.func,
};
