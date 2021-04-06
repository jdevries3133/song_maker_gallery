import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "Styles";

const Slider = styled.span`
  border-radius: 34px;
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  &:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    border-radius: 50%;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
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
    box-shadow: 0 0 1px #37e817;
  }
  &:checked + ${Slider} {
    background-color: #37e817;
  }
  &:checked + ${Slider}:before {
    transform: translateX(26px);
  }
`;

export const ToggleSlider = ({ id, name, labelText }) => {
  const [checked, _setter] = useState(false);
  const toggleChecked = () => {
    _setter(!checked);
  };

  return (
    <Container>
      <label for={id}>{labelText}</label>
      <Input id={id} name={name} type="checkbox" checked={checked} />
      <Slider onClick={toggleChecked} />
    </Container>
  );
};

ToggleSlider.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  labelText: PropTypes.string.isRequired,
};
