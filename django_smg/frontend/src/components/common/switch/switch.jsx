import React, { useState } from "react";
import PropTypes from "prop-types";
import styled, { Label } from "Styles";

const Slider = styled.div`
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
    top: 2px;
    left: 3px;
    height: 21px;
    width: 21px;
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
    box-shadow: 0 0 1px #37e817;
  }
  &:checked + ${Slider} {
    background-color: #37e817;
  }
  &:checked + ${Slider}:before {
    transform: translateX(23px);
  }
`;

export const Switch = ({ labelText, checked = false, id, onChange }) => {
  const [_checked, _setter] = useState(checked);
  const toggleChecked = () => {
    onChange && onChange(!_checked);
    _setter(!_checked);
  };

  return (
    <Container>
      <Label htmlFor={id}>{labelText}</Label>
      <Input
        id={id}
        type="checkbox"
        checked={_checked}
        onChange={toggleChecked}
      />
      <Slider onClick={toggleChecked} />
    </Container>
  );
};

Switch.propTypes = {
  id: PropTypes.string.isRequired,
  labelText: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
};
