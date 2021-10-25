import React, { useState } from "react";
import {
  Button,
  Description,
  Textarea,
  Form,
  Input,
  Label,
  FormErrorText,
} from "Styles";

/**
 * Set gallery name and description
 */
export const BreadCrumbOne = ({ onCrumbComplete }) => {
  const [inputData, setInputData] = useState({
    name: "",
    description: "",
  });
  const [showErrors, setShowErrors] = useState(false);
  const validationErrors = {
    name: [],
    description: [],
  };
  if (inputData.name.length > 100) {
    validationErrors.name.push("must be shorter than 100 characters in length");
  }
  if (!inputData.name.trim()) {
    validationErrors.name.push("cannot be empty");
  }
  if (!inputData.description.trim()) {
    validationErrors.description.push("cannot be empty");
  }
  const submitHandler = (e) => {
    e.preventDefault();
    if (validationErrors.name.length || validationErrors.description.length) {
      setShowErrors(true);
      return;
    }
    onCrumbComplete(inputData);
  };
  return (
    <Description>
      <Form onSubmit={submitHandler}>
        <Label htmlFor="name">Gallery Name</Label>
        {showErrors &&
          validationErrors.name.map((e) => (
            <FormErrorText key={e}>{e}</FormErrorText>
          ))}
        <Input
          value={inputData.name}
          placeholder="name of your gallery"
          onChange={(e) => setInputData({ ...inputData, name: e.target.value })}
          type="text"
          id="name"
        />
        <Label htmlFor="description">Gallery Description</Label>
        {showErrors &&
          validationErrors.description.map((e) => (
            <FormErrorText key={e}>{e}</FormErrorText>
          ))}
        <Textarea
          placeholder="description of your gallery"
          onChange={(e) =>
            setInputData({ ...inputData, description: e.target.value })
          }
          type="text"
          id="description"
          value={inputData.description}
        ></Textarea>
        <Button>Submit</Button>
      </Form>
    </Description>
  );
};
