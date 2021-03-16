import React from "react";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { Route } from "react-router-dom";
import { Context } from "../../test/app_context";

import Login from "./login";
import { loginAction } from "../../test/__mocks__/actions";
import { login, tryToken } from "../../actions/auth.action";

jest.mock("../../actions/auth.action");

beforeEach(() => tryToken.mockImplementation(() => null));

afterEach(() => {
  cleanup();
  tryToken.mockClear();
  login.mockClear();
});

describe("login", () => {
  it("redirects to teacher on success", () => {
    login.mockImplementation(() =>
      loginAction({
        token: "testtoken",
        is_success: true,
      })
    );
    const { getByTestId } = render(
      <Context>
        <Login />
        <Route path="/teacher">
          <div data-testid="teacher"></div>
        </Route>
      </Context>
    );
    fireEvent.input(getByTestId("usernameInput"), "username");
    fireEvent.input(getByTestId("passwordInput"), "password");
    fireEvent.click(getByTestId("loginSubmit"));
    expect(getByTestId("teacher")).toBeTruthy();
  });

  it("shows an error if bad credentials are entered", () => {
    login.mockImplementation(() =>
      loginAction({
        token: null,
        is_success: false,
      })
    );
    const { queryByTestId, getByTestId, getByText } = render(
      <Context>
        <Login />
        <Route path="/teacher">
          <div data-testid="teacher"></div>
        </Route>
      </Context>
    );
    fireEvent.input(getByTestId("usernameInput"), "username");
    fireEvent.input(getByTestId("passwordInput"), "password");
    fireEvent.click(getByTestId("loginSubmit"));
    expect(queryByTestId("teacher")).toBeFalsy();
    getByText("Bad Credentials");
    getByText(
      "Please check that you are using the correct username and password."
    );
  });
});
