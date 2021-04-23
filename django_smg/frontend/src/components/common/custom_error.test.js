import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { ErrorArray, CustomError } from "./custom_error";

const onOk = jest.fn();

beforeEach(() => {
  onOk.mockImplementation(() => {});
});

afterEach(() => {
  onOk.mockClear();
});

describe("ErrorArray", () => {
  it("puts all messages into DOM", () => {
    const msg = ["a", "b", "c"];
    render(<ErrorArray message={msg} onOk={onOk} />);
    msg.forEach((i) => expect(screen.getByText(i)).toBeTruthy());
  });
  it("renders header", () => {
    const header = "test header";
    const msg = ["a", "b", "c"];
    render(<ErrorArray header={header} message={msg} onOk={onOk} />);
    expect(screen.getByText(header)).toBeTruthy();
  });
  it('calls onOk by clicking "Ok" button', async (done) => {
    const msg = ["a", "b", "c"];
    render(<ErrorArray message={msg} onOk={onOk} />);
    fireEvent.click(screen.getByTestId("onOkButton"));
    expect(onOk).toHaveBeenCalledTimes(1);
    done();
  });
});

describe("CustomError", () => {
  it("has onOk button for self-dismissal", async (done) => {
    render(
      <CustomError onOk={onOk}>
        <h1>Hello, world!</h1>
      </CustomError>
    );
    fireEvent.click(screen.getByTestId("onOkButton"));
    expect(onOk).toHaveBeenCalledTimes(1);
    done();
  });
});
