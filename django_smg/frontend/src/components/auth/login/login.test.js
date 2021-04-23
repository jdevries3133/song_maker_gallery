import React from "react";
import {
  act,
  render,
  fireEvent,
  cleanup,
  screen,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { Route } from "react-router-dom";

import { Context } from "Test/app_context";
import { loginAction } from "Test/__mocks__/actions";
import Login from "./index";
import { login, tryToken } from "Actions/auth.action";

jest.mock("Actions/auth.action");

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
    render(
      <Context>
        <Login />
        <Route path="/teacher">
          <div data-testid="teacher"></div>
        </Route>
      </Context>
    );
    fireEvent.input(screen.getByTestId("usernameInput"), "username");
    fireEvent.input(screen.getByTestId("passwordInput"), "password");
    fireEvent.click(screen.getByTestId("loginSubmit"));
    expect(screen.getByTestId("teacher")).toBeTruthy();
  });

  it("shows an error if bad credentials are entered", async (done) => {
    login.mockImplementation(() =>
      loginAction({
        token: null,
        is_success: false,
      })
    );
    render(
      <Context>
        <Login />
        <Route path="/teacher">
          <div data-testid="teacher"></div>
        </Route>
      </Context>
    );
    act(() => {
      fireEvent.input(screen.getByTestId("usernameInput"), "username");
      fireEvent.input(screen.getByTestId("passwordInput"), "password");
      fireEvent.click(screen.getByTestId("loginSubmit"));
    });
    expect(screen.queryByTestId("teacher")).toBeFalsy();
    expect(screen.getByText("Error")).toBeVisible();
    expect(
      screen.getByText(
        "Please check that you are using the correct username and password."
      )
    ).toBeVisible();
    done();
  });
  test("modal window can be dismissed", async (done) => {
    login.mockImplementation(() =>
      loginAction({
        token: null,
        is_success: false,
      })
    );
    render(
      <Context>
        <Login />
        <Route path="/teacher">
          <div data-testid="teacher"></div>
        </Route>
      </Context>
    );
    act(() => {
      fireEvent.input(screen.getByTestId("usernameInput"), "username");
      fireEvent.input(screen.getByTestId("passwordInput"), "password");
      fireEvent.click(screen.getByTestId("loginSubmit"));
    });
    await waitFor(() => {
      expect(screen.queryByTestId("dismissBlanketButton")).toBeVisible();
    });
    act(() => {
      fireEvent.click(screen.getByTestId("dismissBlanketButton"));
    });
    await waitFor(() => {
      expect(screen.queryByTestId("CustomError")).toBeNull();
    });
    done();
  });
});
