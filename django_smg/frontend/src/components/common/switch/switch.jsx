import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "Styles";

const Slider = styled.div`
  box-sizing: content-box; /* border gets applied on focus */
  border-radius: 34px;
  height: 25px;
  width: 50px;
  cursor: pointer;
  background-color: #ccc;
  transition: 0.3s;

  &:before {
    content: "";
    display: block;
    position: relative;
    top: 3px;
    left: 3px;
    height: 19px;
    width: 19px;
    border-radius: 50%;
    background-color: white;
    transition: 0.3s;
  }
`;

const Container = styled.div`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;

  & input {
    opacity: 0;
    width: 0;
    height: 0;
  }
`;

const Input = styled.input`
  &:focus + ${Slider} {
    border-radius: 3px;
    border: 2px solid orange;
    box-shadow: 0 0 1px #37e817;
  }
  &:checked + ${Slider} {
    background-color: #37e817;
  }
  &:checked + ${Slider}:before {
    transform: translateX(25px);
  }
`;

export const Switch = ({ checked = false, id, onChange, className }) => {
  return (
    <Container className={className}>
      <Input id={id} type="checkbox" checked={checked} onChange={onChange} />
      <Slider onClick={onChange} />
    </Container>
  );
};

Switch.propTypes = {
  id: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
};
