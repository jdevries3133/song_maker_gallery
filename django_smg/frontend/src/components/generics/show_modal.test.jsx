import React, { useState, useEffect } from "react";
import {
  cleanup,
  render,
  fireEvent,
  waitFor,
  screen,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import { Portal } from "./portal";

/* simple usage of the portal component */
const ComponentDismounter = () => {
  const [dismount, setDismount] = useState(false);
  return (
    <>
      {dismount ? null : (
        <Portal>
          <h1>Hello, world!</h1>
          <button
            data-testid="dismountPortal"
            onClick={() => setDismount(true)}
          >
            Dismount
          </button>
        </Portal>
      )}
    </>
  );
};

describe("<Portal />", () => {
  // TODO: test generates warning: ReferenceError: You are trying to access a property or method of the Jest environment after it has been torn down.
  // it("mounts in a new dom node", () => {
  //   render(<Portal />);
  //   expect(screen.queryByTestId("portalContainer")).toBeVisible();
  // });
  it("cleans up after self by dismounting parent component", () => {
    render(<ComponentDismounter />);
    expect(screen.queryByText("Hello, world!")).toBeVisible();
    act(() => {
      fireEvent.click(screen.getByTestId("dismountPortal"));
    });
    waitFor(() => {
      expect(screen.queryByTestId("portalContainer")).toBeFalsy();
    });
  });
});
