import React from "react";
import styled from "styled-components";

const color = (index) => {
  const colors = [
    "https://song-maker-gallery.s3.amazonaws.com/manually_added/blue.jpg",
    "https://song-maker-gallery.s3.amazonaws.com/manually_added/green.jpg",
    "https://song-maker-gallery.s3.amazonaws.com/manually_added/pink.jpg",
    "https://song-maker-gallery.s3.amazonaws.com/manually_added/red.jpg",
    "https://song-maker-gallery.s3.amazonaws.com/manually_added/violet.jpg",
    "https://song-maker-gallery.s3.amazonaws.com/manually_added/yellow.jpg",
    "https://song-maker-gallery.s3.amazonaws.com/manually_added/orange.jpg",
  ];
  return `url(${colors[index % colors.length]})`;
};

const Button = styled.button`
  display: inline-block;
  background: ${(props) => props.theme.background};
  background-size: 100% 100%;
  font-family: "Indie Flower";
  font-size: 2.6rem;
  color: RGBA(0, 0, 0, 0);
  width: 17rem;
  height: 6rem;
  margin: 2rem;
  border-radius: 0;
  border-width: 1px;
  border-color: black;
  transition: all 0.3s ease-out;

  @media (min-width: 475px) {
    border: none;
    box-shadow: 1px 0px 7px #888888;
  }

  :focus {
    color: white;
    background: ${(props) => color(props.theme.index)};
    background-size: 100% 100%;
    border-radius: 20px;
    outline-radius: 20px;
    outline: 0;
  }
  :hover {
    /* same as focus */
    color: white;
    background: ${(props) => color(props.theme.index)};
    background-size: 100% 100%;
    border-radius: 20px;
    outline-radius: 20px;
    outline: 0;
  }
`;

export default Button;
