import React from "react";
import {
  waitFor,
  render,
  fireEvent,
  screen,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import "jest-styled-components";

import { Blanket } from "./index";

jest.mock("Common/portal/portal");

const onOk = jest.fn();

afterEach(() => onOk.mockClear());

describe("<Blanket />", () => {
  it("renders children inside self", () => {
    render(
      <Blanket>
        <h1>hello world</h1>
      </Blanket>
    );
    expect(screen.queryByText("hello world")).toBeVisible();
  });

  it("contains a button which calls an optional callback fn passed as a prop", async (done) => {
    render(<Blanket onDismissed={onOk} />);
    act(() => {
      fireEvent.click(screen.getByTestId("dismissBlanketButton"));
    });
    await waitFor(() => {
      expect(onOk).toHaveBeenCalled();
    });
    done();
  });

  it("unmounts itself when close button is pressed", async (done) => {
    render(<Blanket onDismissed={onOk} />);
    act(() => {
      fireEvent.click(screen.getByTestId("dismissBlanketButton"));
    });
    await waitFor(() => {
      expect(screen.queryByTestId("blanket")).toBeNull();
      done();
    });
  });

  it("can be initialized without being mounted", async (done) => {
    render(<Blanket enabled={false} />);
    await waitFor(() => {
      expect(screen.queryByTestId("blanket")).toBeNull();
    });
    done();
  });
});
