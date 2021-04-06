import React from "react";
import {
  act,
  render,
  fireEvent,
  screen,
  waitFor,
} from "@testing-library/react";
import { Context as TestContext } from "Test/app_context";
import "@testing-library/jest-dom";
import "jest-styled-components";

import { updateUser } from "Actions/auth.action";
import { ChangeEmail } from "./change_email";

jest.mock("Actions/auth.action");

beforeEach(() =>
  render(<ChangeEmail changeEmail={updateUser} userId={1} token="testtoken" />)
);

describe("<ChangeEmail />", () => {
  it("calls changeEmail fn when form has valid data", async (done) => {
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
    done();
  });
});
