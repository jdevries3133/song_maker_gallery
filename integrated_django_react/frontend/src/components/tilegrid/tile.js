import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import styles from './tilegrid.module.css';

const tile = props => {

  // todo make all the colors load on initial page load, so they don't lag behind.
  // or, transition from background-image to background-color if possible

  const colors= [
    'http://song-maker-gallery.s3.amazonaws.com/manually_added/blue.jpg',
    'http://song-maker-gallery.s3.amazonaws.com/manually_added/green.jpg',
    'http://song-maker-gallery.s3.amazonaws.com/manually_added/orange.jpg',
    'http://song-maker-gallery.s3.amazonaws.com/manually_added/pink.jpg',
    'http://song-maker-gallery.s3.amazonaws.com/manually_added/red.jpg',
    'http://song-maker-gallery.s3.amazonaws.com/manually_added/violet.jpg',
    'http://song-maker-gallery.s3.amazonaws.com/manually_added/yellow.jpg',
  ]

  const color = colors[props.index % 7]

  const anim_in = keyframes`
    from {
      color: rgba(0, 0, 0, 0);
      background: inherit;
      border-radius: 0;
    }
    to {
      color: white;
      background: url(${color});
      border-radius: 20%;
    }
  `

  const anim_out = keyframes

  const Button = styled.button`
    display: inline-block;
    background: url(${props.st_arr[2]});
    background-size: contain;
    font-family: 'Indie Flower';
    font-size: 2.6rem;
    color: RGBA(0, 0, 0, 0);
    width: 17rem;
    height: 6rem;
    margin: 2rem;
    animation-name: ${anim_out};
    animation-direction: forwards;
    animation-fill-mode: forwards;
    animation-duration: .3s;

    :hover {
      animation-name: ${anim_in};
      animation-direction: forwards;
      animation-fill-mode: forwards;
      animation-duration: .3s;
    }
  `


  return (
    <li className={styles.lit}>
    <a href={props.st_arr[1]} target='_blank' rel='noopener noreferrer'>
      <Button>{props.st_arr[0]}</Button>
      </a>
    </li>
  )
}

export default tile
