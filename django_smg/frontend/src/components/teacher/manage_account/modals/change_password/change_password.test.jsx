import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import "jest-styled-components";

import { ChangePassword } from "./change_password";

const updateUsrFunc = jest.fn();

beforeEach(() =>
  render(<ChangePassword changePassword={updateUsrFunc} userId={1} />)
);

afterEach(() => updateUsrFunc.mockClear());

describe("<ChangePassword />", () => {
  it("calls changePassword fn when form has valid data", async (done) => {
    fireEvent.change(screen.getByTestId("curPasswordInput"), {
      target: { value: "currentPass" },
    });
    fireEvent.change(screen.getByTestId("newPasswordInput"), {
      target: { value: "newPass" },
    });

    fireEvent.click(screen.getByTestId("submit"));
    await waitFor(() => {
      expect(updateUsrFunc).toHaveBeenCalledWith(1, "currentPass", "newPass");
    });
    done();
  });
});
