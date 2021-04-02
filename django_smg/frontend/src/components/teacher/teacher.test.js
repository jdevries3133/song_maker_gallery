import React from "react";
import { act, render, fireEvent, screen } from "@testing-library/react";
import { Context as TestContext } from "Test/app_context";
import "@testing-library/jest-dom";
import "jest-styled-components";

import { logout } from "Actions/auth.action";
import Teacher from "./index";

jest.mock("Actions/user");
jest.mock("Actions/auth.action");

describe("<Teacher />", () => {
  it("has logout button which calls logout action on click", async (done) => {
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
    done();
  });
});
