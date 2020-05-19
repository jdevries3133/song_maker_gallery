import React from 'react';
import styled, { keyframes } from 'styled-components';

const tile = props => {

  const colors = [
    '/blue.jpg',
    '/green.jpg',
    '/orange.jpg',
    'pink.jpg',
    '/red.jpg',
    '/violet.jpg',
    '/yellow.jpg',
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
    <li className='lit'>
    <a href={props.st_arr[1]} target='_blank' rel='noopener noreferrer'>
      <Button>{props.st_arr[0]}</Button>
      </a>
    </li>
  )
}

export default tile
