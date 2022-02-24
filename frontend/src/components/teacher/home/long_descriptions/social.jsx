import React from "react";
import { P, Button } from "Styles";

import { LongDescriptionContainer } from "./commonStyles";

export const SocialDescription = ({ ctaHandler }) => (
  <LongDescriptionContainer>
    <P>
      Nothing engages students like social media, and response is a key
      component of{" "}
      <a
        href="https://www.nationalartsstandards.org/"
        target="_blank"
        rel="noopener noreferrer"
      >
        U.S. National Core Arts Standards{" "}
      </a>
    </P>
    <P>
      All you need to do is flip the switch, and any gallery; past, present, or
      future, will become a social gallery. In social galleries, students can
      comment and react to their peers' compositions.
    </P>
    <Button block onClick={ctaHandler}>
      Learn More
    </Button>
    <P>
      <i>
        Social galleries are highly configurable, and it is easy to tightly
        oversee them as a teacher. Click "learn more," to find out if there is a
        configuration that meets your needs!!
      </i>
    </P>
  </LongDescriptionContainer>
);
