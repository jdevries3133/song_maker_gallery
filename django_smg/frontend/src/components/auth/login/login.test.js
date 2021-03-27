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

import { Context } from "../../../test/app_context";
import { loginAction } from "../../../test/__mocks__/actions";
import Login from "./index";
import { login, tryToken } from "../../../actions/auth.action";

jest.mock("../../../actions/auth.action");

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

  it("shows an error if bad credentials are entered", () => {
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
    await act(async () => {
      fireEvent.input(screen.getByTestId("usernameInput"), "username");
      fireEvent.input(screen.getByTestId("passwordInput"), "password");
      fireEvent.click(screen.getByTestId("loginSubmit"));
    });
    await waitFor(() => {
      expect(screen.getByTestId("onOkButton")).toBeVisible();
    });
    await act(async () => {
      fireEvent.click(screen.getByTestId("onOkButton"));
    });
    await waitFor(() => {
      expect(screen.queryByTestId("CustomError")).toBeNull();
    });
    done();
  });
});
