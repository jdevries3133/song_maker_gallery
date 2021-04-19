import React, { useRef } from "react";
import PropTypes from "prop-types";

import styled from "Styles";
import { useScrollCallback } from "Common/useScrollCallback";

import { SocialEvent } from "./event";

const Container = styled.div`
  max-width: 100vw;
  max-height: 100vh;
  overflow: scroll;
`;

export const EventStream = ({ events, fetchMoreEvents }) => {
  const rootRef = useRef(null);
  const targetRef = useRef(null);

  useScrollCallback(fetchMoreEvents, targetRef, rootRef);

  return (
    <Container ref={rootRef}>
      {events.map((event, i) =>
        // target second to last item for infinite scroll trigger
        i == events.length - 2 ? (
          <SocialEvent key={i} ref={targetRef} event={event} />
        ) : (
          <SocialEvent key={i} event={event} />
        )
      )}
    </Container>
  );
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
