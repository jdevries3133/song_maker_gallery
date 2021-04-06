import React, { useState } from "react";
import PropTypes from "prop-types";
import { H2, Button, Input } from "Styles";

export const ChangeEmail = ({ changeEmail, userId, token }) => {
  const [email, setEmail] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    changeEmail(email, userId, token);
  };
  return (
    <>
      <H2>Change Account Email</H2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="newEmail">New Email</label>
        <Input
          data-testid="newEmailInput"
          type="test"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <Button
          data-testid="newEmailFormSubmit"
          as="input"
          type="submit"
          value="Submit"
        />
      </form>
    </>
  );
};

ChangeEmail.propTypes = {
  /* function(newEmail, userId, token) to change email */
  changeEmail: PropTypes.func,

  /* current user credentials */
  userId: PropTypes.number,
  token: PropTypes.string,
};
