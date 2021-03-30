import React from "react";
import { act, render, fireEvent, screen } from "@testing-library/react";
import { Context as TestContext } from "../../test/app_context";
import "@testing-library/jest-dom";

import { logout } from "../../actions/auth.action";
import Teacher from "./index";

jest.mock("../../actions/user");
jest.mock("../../actions/auth.action");

describe("<Teacher />", () => {
  it("has logout button which calls logout action on click", async () => {
    render(
      <TestContext
        initialState={{ auth: { isAuthenticated: true, token: "testtoken" } }}
      >
        <Teacher />
      </TestContext>
    );
    expect(screen.getByTestId("logoutButton")).toBeVisible();
    act(() => {
      fireEvent.click(screen.getByTestId("logoutButton"));
    });
    expect(logout).toHaveBeenCalledTimes(1);
    expect(logout).toHaveBeenCalledWith("testtoken");
  });
});
