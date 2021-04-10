import React, { useReducer } from "react";

import styled, {
  H2,
  Button as DefaultButton,
  Form,
  Label,
  Input,
} from "Styles";

const Button = styled(DefaultButton)`
  max-width: 100px;
`;

const initialState = {
  curPassword: "",
  newPassword: "",
};
const types = { NEW_PASSWORD: "NEW_PASSWORD", CUR_PASSWORD: "CUR_PASSWORD" };
const reducer = (state, action) => {
  switch (action.type) {
    case types.NEW_PASSWORD:
      return {
        ...state,
        newPassword: action.value,
      };
    case types.CUR_PASSWORD:
      return {
        ...state,
        curPassword: action.value,
      };
    default:
      throw new Error(`Unsupported type: ${action.type}`);
  }
};

export const ChangePassword = ({ changePassword, userId }) => {
  // TODO: follow-up view to confirm action or report error
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleCur = (e) =>
    dispatch({ type: types.CUR_PASSWORD, value: e.target.value });
  const handleNew = (e) =>
    dispatch({ type: types.NEW_PASSWORD, value: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    changePassword(userId, state.curPassword, state.newPassword);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <H2>Change Password</H2>
      <Label htmlFor="current">Current Password</Label>
      <Input
        data-testid="curPasswordInput"
        onChange={handleCur}
        value={state.curPassword}
        type="password"
        id="current"
        autocomplete="current-password"
      />
      <Label htmlFor="new">New Password</Label>
      <Input
        data-testid="newPasswordInput"
        onChange={handleNew}
        value={state.newPassword}
        type="password"
        id="new"
        autocomplete="new-password"
      />
      <Button data-testid="submit" as="input" type="submit" value="Submit" />
    </Form>
  );
};
