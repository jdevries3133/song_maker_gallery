// import React from "react";
import styled, { keyframes } from "styled-components";

const anim_in1 = keyframes`
  from {
    color: rgba(0, 0, 0, 0);
    background: inherit;
    border-radius: 0;
  }
  to {
    color: white;
    background: url(https://song-maker-gallery.s3.amazonaws.com/manually_added/blue.jpg);
    border-radius: 20px;
  }
`;

const anim_in2 = keyframes`
  from {
    color: rgba(0, 0, 0, 0);
    background: inherit;
    border-radius: 0;
  }
  to {
    color: white;
    background: url(https://song-maker-gallery.s3.amazonaws.com/manually_added/green.jpg);
    border-radius: 20px;
  }
`;

const anim_in3 = keyframes`
  from {
    color: rgba(0, 0, 0, 0);
    background: inherit;
    border-radius: 0;
  }
  to {
    color: white;
    background: url(https://song-maker-gallery.s3.amazonaws.com/manually_added/pink.jpg);
    border-radius: 20px;
  }
`;

const anim_in4 = keyframes`
  from {
    color: rgba(0, 0, 0, 0);
    background: inherit;
    border-radius: 0;
  }
  to {
    color: white;
    background: url(https://song-maker-gallery.s3.amazonaws.com/manually_added/red.jpg);
    border-radius: 20px;
  }
`;

const anim_in5 = keyframes`
  from {
    color: rgba(0, 0, 0, 0);
    background: inherit;
    border-radius: 0;
  }
  to {
    color: white;
    background: url(https://song-maker-gallery.s3.amazonaws.com/manually_added/violet.jpg);
    border-radius: 20px;
  }
`;
const anim_in6 = keyframes`
  from {
    color: rgba(0, 0, 0, 0);
    background: inherit;
    border-radius: 0;
  }
  to {
    color: white;
    background: url(https://song-maker-gallery.s3.amazonaws.com/manually_added/yellow.jpg);
    border-radius: 20px;
  }
`;
const anim_in7 = keyframes`
  from {
    color: rgba(0, 0, 0, 0);
    background: inherit;
    border-radius: 0;
  }
  to {
    color: white;
    background: url(https://song-maker-gallery.s3.amazonaws.com/manually_added/orange.jpg);
    border-radius: 20px;
  }
`;

const anim_out = keyframes; // finish

const Button = styled.button`
  display: inline-block;
  background: url(${(props) => props.theme.background});
  background-size: 100% 100%;
  font-family: "Indie Flower";
  font-size: 2.6rem;
  color: RGBA(0, 0, 0, 0);
  width: 17rem;
  height: 6rem;
  margin: 2rem;
  animation-name: ${anim_out};
  animation-direction: forwards;
  animation-fill-mode: forwards;
  animation-duration: 0.3s;
  border-width: 0;
  border-radius: 0;

  :hover {
    animation-name: ${(props) => {
      const animations = [
        anim_in1,
        anim_in2,
        anim_in3,
        anim_in4,
        anim_in5,
        anim_in6,
        anim_in7,
      ];
      return animations[props.theme.index % 7];
    }};
    animation-direction: forwards;
    animation-fill-mode: forwards;
    animation-duration: 0.3s;
    cursor: pointer;
  }
`;

export default Button;
