import React from "react";
import renderer from "react-test-renderer";
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { Context } from "../../test/app_context";

import Signup from "./signup";
import { REGISTER } from "../../actions/types";
import { register } from "../../actions/auth.action";
import { Tos, Privacy } from "../legal";
import { ErrorArray } from "../generics/custom_error";

jest.mock("../generics/custom_error");
jest.mock("../legal");
jest.mock("../../actions/auth.action");

Tos.mockImplementation(() => <span>TOS MOCK</span>);
Privacy.mockImplementation(() => <span>PRIVACY POLICY MOCK</span>);
ErrorArray.mockImplementation(() => <span>MOCK ERRORARRAY</span>);

beforeEach(() => {
  render(
    <Context>
      <Signup />
    </Context>
  );
});

afterEach(() => {
  register.mockClear();
  ErrorArray.mockClear();
});

const submitForm = async (
  data = {
    email: "test@testuser.com",
    username: "testuser",
    password: "123456789",
  }
) => {
  await act(async () => {
    fireEvent.change(screen.getByTestId("emailInput"), {
      target: { value: data.email },
    });
    fireEvent.change(screen.getByTestId("usernameInput"), {
      target: { value: data.username },
    });
    fireEvent.change(screen.getByTestId("passwordInput"), {
      target: { value: data.password },
    });
    fireEvent.change(screen.getByTestId("passwordConfirmInput"), {
      target: { value: data.password },
    });
    fireEvent.click(screen.getByTestId("tosCheckbox"));
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId("submit"));
  });
  return data;
};

describe("<Signup />", () => {
  it("matches snapshot", () => {
    const tree = renderer
      .create(
        <Context>
          <Signup />
        </Context>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("tells user when passwd is too short", () => {
    expect(
      screen.getByText("Your password must be at least eight characters long")
    ).toBeVisible();
  });

  it("tells user when passswd is long enough with green text", async (done) => {
    // action: input password
    act(() => {
      fireEvent.change(screen.getByTestId("passwordInput"), {
        target: { value: "123456789" },
      });
    });

    // assertions
    await waitFor(() => {
      expect(
        screen.queryByText("Your password is at least eight characters long")
      ).toBeVisible();
      expect(
        screen.queryByText("Your password is at least eight characters long")
      ).toHaveStyle("color: green;");
    });
    done();
  });
  it("restores original passwd length message after deleting password", async (done) => {
    // actions
    // input password
    act(() => {
      fireEvent.change(screen.getByTestId("passwordInput"), {
        target: { value: "123456789" },
      });
    });
    // partially remove password
    await act(async () => {
      fireEvent.change(screen.getByTestId("passwordInput"), {
        target: { value: "123456" },
      });
    });

    // assertions
    await waitFor(() => {
      expect(
        screen.getByText("Your password must be at least eight characters long")
      ).toBeVisible();
    });
    done();
  });
  it("disallows empty fields", async (done) => {
    await act(async () => {
      fireEvent.click(screen.getByTestId("submit"));
    });
    await waitFor(() => {
      expect(ErrorArray).toHaveBeenCalledWith(
        {
          header: "Blank Fields",
          message: ["Required fields are blank", "All fields are required."],
          onOk: expect.anything(),
        },
        expect.anything() // other args from react framework, etc.
      );
    });
    done();
  });
  it("calls user register action on form submission", async (done) => {
    const data = await submitForm();
    await waitFor(() => {
      expect(register).toHaveBeenCalledTimes(1);
      expect(register).toHaveBeenCalledWith(data);
    });
    done();
  });
  it("renders 400 error messages from server", async (done) => {
    const fakeApiResponse = {
      username: ["A user with that username already exists"],
      email: ["Invalid email address"],
    };
    register.mockImplementation(() => (dispatch) => {
      dispatch({
        type: REGISTER,
        payload: {
          isAuthenticated: false,
          authError: fakeApiResponse,
          token: null,
          user: null,
        },
      });
    });
    await submitForm();
    expect(ErrorArray).toHaveBeenCalledWith(
      {
        header: "Validation Error",
        message: expect.arrayContaining([
          `username: ${fakeApiResponse["username"]}`,
          `email: ${fakeApiResponse["email"]}`,
        ]),
        onOk: expect.anything(),
      },
      expect.anything()
    );
    done();
  });
  it("normalizes authErrors that are strings before passing to <ErrorArray />", async (done) => {
    register.mockImplementation(() => (dispatch) => {
      dispatch({
        type: REGISTER,
        payload: {
          isAuthenticated: false,
          authError: "something bad happened",
          token: null,
          user: null,
        },
      });
    });
    await submitForm();
    expect(ErrorArray).toHaveBeenCalledWith(
      {
        message: expect.arrayContaining(["Error: something bad happened"]),
        header: "Validation Error",
        onOk: expect.anything(),
      },
      expect.anything()
    );
    done();
  });
  it("notifies user of 500 error response", () => {});
});
