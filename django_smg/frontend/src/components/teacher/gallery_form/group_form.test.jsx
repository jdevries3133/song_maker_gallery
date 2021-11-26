import React, { useState } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";

import { Context as C } from "Common/storybook_util";

import { DraggableTile } from "./draggable_tile";
import { GroupForm } from "./group_form";

const MOCK_GROUP = {
  students: [
    {
      songId: 678,
      student_name: "tim",
      order: 0,
    },
    {
      songId: 679,
      student_name: "sally",
      order: 1,
    },
  ],
};

jest.mock("axios");
jest.mock("./draggable_tile.jsx");

axios.patch.mockResolvedValue({ data: MOCK_GROUP });

DraggableTile.mockImplementation(({ swap, index }) => {
  const [val, set] = useState("0");
  const triggerSwap = () => swap(index, parseInt(val));
  return (
    <>
      <p>I am position {index}</p>
      <p>
        <span>swap me with position: </span>
        <input
          data-testid={`swapWith${index}`}
          type="text"
          onChange={(e) => set(e.target.value)}
          value={val}
        />
      </p>
      <button data-testid={`trigger${index}`} onClick={triggerSwap}>
        trigger swap
      </button>
    </>
  );
});

describe("GroupForm", () => {
  /* given indices a and b, simulate a swap using the mocked out component
   * above, to avoid the complexity of mocking the dragging and dropping stuff
   */
  const simulateSwap = (a, b) => {
    screen.debug();
    act(() => {
      fireEvent.change(screen.getByTestId(`swapWith${a}`), {
        target: { value: b.toString() },
      });
      fireEvent.click(screen.getByTestId(`trigger${a}`));
    });
  };
  beforeEach(() => {
    act(() => {
      render(
        <C>
          <GroupForm group={MOCK_GROUP} />
        </C>
      );
    });
  });
  it("calls axios.patch when the swap func is triggered", () => {
    simulateSwap(0, 1);
    expect(axios.patch).toHaveBeenCalled();
  });
  it("passes the correct indices to axios", () => {
    expect(axios.patch).toHaveBeenCalledWith();
  });
});
