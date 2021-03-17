import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { BadRequest, CustomError } from "./validation_error";

const MOCK_ERR_MSG = {
  Message: ["Internal Server Error", "Something bad happened on the server"],
  Code: [500],
};

let onOk;

beforeEach(() => {
  onOk = jest.fn();
  onOk.mockImplementation(() => {});
});

afterEach(() => {
  cleanup;
  onOk.mockClear();
});

describe("BadRequest", () => {
  it("renders errors", async () => {
    const { queryAllByTestId } = render(
      <BadRequest serverErrorMessage={MOCK_ERR_MSG} onOk={onOk} />
    );

    // Render key as title
    let nodes = queryAllByTestId("errMsgTitle");
    expect(nodes.length).toBe(2);
    expect(nodes[0]).toHaveTextContent("Message");
    expect(nodes[1]).toHaveTextContent("Code");

    // Render description as value
    nodes = queryAllByTestId("errMsgItem");
    expect(nodes.length).toBe(3);
    expect(nodes[0]).toHaveTextContent("Internal Server Error");
    expect(nodes[1]).toHaveTextContent("Something bad happened on the server");
    expect(nodes[2]).toHaveTextContent("500");
  });
});

describe("CustomError", () => {
  it("has onOk button for self-dismissal", () => {
    const { getByTestId } = render(
      <CustomError onOk={onOk}>
        <h1>Hello, world!</h1>
      </CustomError>
    );
    fireEvent.click(getByTestId("onOkButton"));
    expect(onOk).toHaveBeenCalledTimes(1);
  });
});
