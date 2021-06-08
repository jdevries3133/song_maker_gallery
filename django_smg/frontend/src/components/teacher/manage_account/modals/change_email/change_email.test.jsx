import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import "jest-styled-components";

import { updateUser } from "Actions/auth.action";
import { ChangeEmail } from "./change_email";

// TODO: this is using redux in a kind of cursed way... circle back when
// real actions are implemented
jest.mock("Actions/auth.action");

beforeEach(() =>
  render(<ChangeEmail changeEmail={updateUser} userId={1} token="testtoken" />)
);

describe("<ChangeEmail />", () => {
  it("calls changeEmail fn when form has valid data", async () => {
    fireEvent.change(screen.getByTestId("newEmailInput"), {
      target: { value: "neweml@newaddr.com" },
    });
    fireEvent.click(screen.getByTestId("newEmailFormSubmit"));
    await waitFor(() => {
      expect(updateUser).toHaveBeenCalledWith(
        "neweml@newaddr.com",
        1,
        "testtoken"
      );
    });
  });
});
