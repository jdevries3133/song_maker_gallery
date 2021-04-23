import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import { useModals, types } from "./useModals";

/******************************************************************************
 * Setup Fixtures
 */

export const SimpleUsage = (props) => {
  const [modals, dispatchModals] = useModals({
    props,
    modals: [
      {
        // pure prop-dependent modal
        test: (props) => props.showPropDependent ?? false,
        show: () => <h1>Prop dependent modal</h1>,
        onDismissed: onDismissedCallback,
      },
      {
        // modal that will be managed by this component
        name: "The Modal",
        show: () => <h1>Component-Managed Modal</h1>,
        onDismissed: onDismissedCallback,
      },
    ],
  });
  return (
    <>
      {modals}
      <button
        data-testid="show modal"
        onClick={() => dispatchModals("The Modal")}
      >
        Show Modal
      </button>
      <button
        data-testid="remove modal"
        onClick={() => dispatchModals("The Modal", null, types.REMOVE)}
      >
        Remove Modal
      </button>
    </>
  );
};

/* calling dispatch(types.SHOW) repeatedly should be safe */
const InfiniteReRenderRisk = (props) => {
  const [modals, dispatchModals] = useModals({
    props,
    modals: [
      {
        name: "Recursion Risk",
        show: () => <h1>do not recurse me</h1>,
      },
    ],
  });

  // default dispatch type is types.SHOW
  dispatchModals("Recursion Risk");
  return modals;
};

const onDismissedCallback = jest.fn();
afterEach(() => onDismissedCallback.mockClear());

/******************************************************************************
 * Tests Fixtures
 */

describe("useModals", () => {
  it("can initially show modals based on props", () => {
    render(<SimpleUsage showPropDependent={true} />);
    expect(screen.queryByTestId("blanket")).toBeVisible();
  });

  it("can initially hide modals based on props", () => {
    render(<SimpleUsage showPropDependent={false} />);
    expect(screen.queryByTestId("blanket")).toBeNull();
  });

  it("calls callback function when modal is closed", async (done) => {
    render(<SimpleUsage showPropDependent={true} />);
    fireEvent.click(screen.getByTestId("dismissBlanketButton"));
    await waitFor(() => expect(onDismissedCallback).toHaveBeenCalled());
    done();
  });

  it("mounts and unmounts modal through dispatcher", async (done) => {
    render(<SimpleUsage />);

    // mount
    fireEvent.click(screen.getByTestId("show modal"));
    await waitFor(() => {
      expect(screen.queryByTestId("blanket")).toBeVisible();
      expect(screen.queryByText("Component-Managed Modal")).toBeVisible();
    });

    //unmount
    fireEvent.click(screen.getByTestId("remove modal"));
    await waitFor(() => {
      expect(screen.queryByTestId("blanket")).toBeNull();
      expect(screen.queryByText("Component-Managed Modal")).toBeNull();
    });
    done();
  });

  it("resists inifinite re-renders", () => {
    // if this just renders without an error, we are ok
    render(<InfiniteReRenderRisk />);
  });
});
