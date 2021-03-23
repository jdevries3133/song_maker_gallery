import React from "react";
import renderer from "react-test-renderer";
import { render, screen, fireEvent } from "@testing-library/react";
import { Context } from "../../test/app_context";

import Signup from "./signup";

import { register, clearError } from "../../actions/auth.action";

jest.mock("../../actions/auth.action");

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
  // TODO: write tests
  it("validates password length", () => {
    render(
      <Context>
        <Signup />
      </Context>
    );
  });
  it("diallows empty fields", () => {});
  it("passes 400 error messages from server to user", () => {});
  it("notifies user of 500 error response", () => {});
});
