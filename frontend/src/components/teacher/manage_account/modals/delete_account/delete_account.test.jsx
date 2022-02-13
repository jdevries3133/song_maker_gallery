import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import "jest-styled-components";

import { Context as TestContext } from "Common/storybook_util";

import { deleteAccount } from "Actions/auth.action";

import DeleteAccount from "./index";
import { ATTESTATION } from "./attestation";

jest.mock("Actions/auth.action");

beforeEach(() =>
  render(
    <TestContext initialState={{ auth: { id: 4 } }}>
      <DeleteAccount deleteAccount={deleteAccount} userId={1} />
    </TestContext>
  )
);

afterEach(() => deleteAccount.mockClear());

describe("<ChangeEmail />", () => {
  it("does not allow form submission without attestation", async () => {
    fireEvent.change(screen.getByTestId("password"), {
      target: { value: "my_password" },
    });
    fireEvent.click(screen.getByTestId("submit"));
    await waitFor(() => expect(deleteAccount).toHaveBeenCalledTimes(0));
  });
  it("shows warning upon incorrect submission attempt", async () => {
    fireEvent.change(screen.getByTestId("password"), {
      target: { value: "my_password" },
    });
    fireEvent.click(screen.getByTestId("submit"));

    await waitFor(() =>
      expect(
        screen.queryByText(
          "You must type the statement above in the space below to proceed."
        )
      ).toBeVisible()
    );
  });
  it("calls action with userId and passwd on form submit", async () => {
    fireEvent.change(screen.getByTestId("password"), {
      target: { value: "my_password" },
    });
    fireEvent.change(screen.getByTestId("attestation"), {
      target: { value: ATTESTATION },
    });
    fireEvent.click(screen.getByTestId("submit"));
    await waitFor(() =>
      expect(deleteAccount).toHaveBeenCalledWith(4, "my_password")
    );
  });
});
