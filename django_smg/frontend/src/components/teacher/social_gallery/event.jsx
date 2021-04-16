import React, { forwardRef } from "react";

import { Like, Heart, Star } from "Common/icon";

import { Comment } from "./comment";
import { Reaction } from "./reaction";

export const SocialEvent = forwardRef((props, ref) => {
  const { event } = props;
  switch (event.type) {
    case "like":
      return <Reaction icon={<Like ref={ref} />} {...event} />;
    case "heart":
      return <Reaction icon={<Heart ref={ref} />} {...event} />;
    case "star":
      return <Reaction icon={<Star ref={ref} />} {...event} />;
    case "comment":
      return <Comment {...event} />;
    default:
      throw new Error("unsupported event type: ${event.type}");
  }
});
