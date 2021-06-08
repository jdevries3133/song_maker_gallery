import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { Context as TestContext } from "Common/storybook_util";
import "@testing-library/jest-dom";
import "jest-styled-components";

import { logout } from "Actions/auth.action";
import Teacher from "./index";

jest.mock("Actions/user");
jest.mock("Actions/auth.action");

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
    fireEvent.click(screen.getByTestId("logoutButton"));
    expect(logout).toHaveBeenCalledTimes(1);
    expect(logout).toHaveBeenCalledWith("testtoken");
  });
});
