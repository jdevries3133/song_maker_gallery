import React from "react";
import renderer from "react-test-renderer";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import "jest-styled-components";

import { Context } from "Common/storybook_util";

import Signup from "./index";
import { REGISTER } from "Actions/types";
import { register } from "Actions/auth.action";
import { Tos, Privacy } from "../../legal";

jest.mock("../../legal");
jest.mock("Actions/auth.action");

Tos.mockImplementation(() => <span>TOS MOCK</span>);
Privacy.mockImplementation(() => <span>PRIVACY POLICY MOCK</span>);

beforeEach(() => {
  render(
    <Context>
      <Signup />
    </Context>
  );
});

afterEach(() => {
  register.mockClear();
});

const fillOutFields = (data) => {
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
};

const submitForm = async (
  data = {
    email: "test@testuser.com",
    username: "testuser",
    password: "123456789",
  }
) => {
  fillOutFields(data);
  fireEvent.submit(screen.getByTestId("signupForm"));
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
    fireEvent.change(screen.getByTestId("passwordInput"), {
      target: { value: "123456789" },
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
  it("warns user if they put a space in the username", async (done) => {
    fireEvent.change(screen.getByTestId("usernameInput"), {
      target: { value: " " },
    });
    expect(
      screen.queryByText("Username may not contain spaces.")
    ).toBeVisible();
    fireEvent.change(screen.getByTestId("usernameInput"), {
      target: { value: "nospaces" },
    });
    expect(screen.queryByText("Username may not contain spaces.")).toBeNull();
    done();
  });
  it("restores original passwd length message after deleting password", async (done) => {
    // actions
    // input password
    fireEvent.change(screen.getByTestId("passwordInput"), {
      target: { value: "123456789A" },
    });
    // partially remove password
    fireEvent.change(screen.getByTestId("passwordInput"), {
      target: { value: "123456" },
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
    fireEvent.submit(screen.getByTestId("signupForm"));
    await waitFor(() => {
      expect(screen.queryByText("Blank Fields")).toBeVisible();
      expect(screen.queryByText("Required fields are blank")).toBeVisible();
      expect(screen.queryByText("All fields are required.")).toBeVisible();
    });
    done();
  });
  it("disallows mismatched passwords", async (done) => {
    fillOutFields({
      username: "myuser",
      email: "myuser@email.com",
      password: "thispassword",
    });

    // change password confirm to something that does not match
    fireEvent.change(screen.getByTestId("passwordConfirmInput"), {
      target: { value: "mismatch" },
    });

    // hint should show before form submission
    await waitFor(() => {
      expect(screen.getByText("Passwords do not match")).toBeVisible();
    });

    // submit form
    fireEvent.submit(screen.getByTestId("signupForm"));
    await waitFor(() => {
      expect(screen.getByTestId("passwordMismatchModal")).toHaveTextContent(
        "Passwords do not match"
      );
    });
    done();
  });
  it("disallows empty TOS checkbox", () => {
    fillOutFields({
      username: "myuser",
      email: "myuser@email.com",
      password: "thispassword",
    });
    // toggle back off after above toggles it on
    fireEvent.click(screen.getByTestId("tosCheckbox"));
    // submit form
    fireEvent.submit(screen.getByTestId("signupForm"));

    expect(screen.getByTestId("tosModalHeader")).toHaveTextContent(
      "Terms of Service"
    );
    expect(
      screen.queryByText(
        "You must accept the terms of service to make an account"
      )
    ).toBeVisible();
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
    await waitFor(async () => {
      expect(
        screen.queryByText("username: A user with that username already exists")
      ).toBeVisible();
      expect(screen.queryByText("email: Invalid email address")).toBeVisible();
    });
    done();
  });
});
