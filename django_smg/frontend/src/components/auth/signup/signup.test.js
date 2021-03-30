import React from "react";
import renderer from "react-test-renderer";
import "jest-styled-components";
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { Context } from "Test/app_context";

import Signup from "./index";
import { REGISTER } from "Actions/types";
import { register } from "Actions/auth.action";
import { Tos, Privacy } from "../../legal";
import { ErrorArray } from "Common/custom_error";

jest.mock("Common/custom_error");
jest.mock("../../legal");
jest.mock("Actions/auth.action");

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
    fireEvent.submit(screen.getByTestId("signupForm"));
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
  it("warns user if they put a space in the username", () => {
    act(() => {
      fireEvent.change(screen.getByTestId("usernameInput"), {
        target: { value: " " },
      });
    });
    expect(
      screen.queryByText("Username may not contain spaces.")
    ).toBeVisible();
    act(() => {
      fireEvent.change(screen.getByTestId("usernameInput"), {
        target: { value: "nospaces" },
      });
    });
    expect(screen.queryByText("Username may not contain spaces.")).toBeNull();
  });
  it("restores original passwd length message after deleting password", async (done) => {
    // actions
    // input password
    act(() => {
      fireEvent.change(screen.getByTestId("passwordInput"), {
        target: { value: "123456789A" },
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
      fireEvent.submit(screen.getByTestId("signupForm"));
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
});
