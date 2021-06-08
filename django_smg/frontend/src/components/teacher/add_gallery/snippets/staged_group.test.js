import React from "react";
import {
  screen,
  render,
  waitFor,
  act,
  fireEvent,
} from "@testing-library/react";
import "@testing-library/jest-dom";

import { StagedGroup } from "./staged_group";

// used by every mock student here
const LINK =
  "https://musiclab.chromeexperiments.com/Song-Maker/song/5635608291049472";
export const SAMPLE_GROUP = [
  ["John A.", LINK],
  ["Sally Gregson", LINK],
  ["Mike", LINK],
  "Group 1",
];

describe("StagedGroup", () => {
  it("has dropdown that renders group member list", async () => {
    render(<StagedGroup group={SAMPLE_GROUP} />);
    act(() => {
      fireEvent.click(screen.getByTestId("sgToggleDropdown"));
    });
    await waitFor(() => {
      screen
        .queryAllByTestId("dropdownRow")
        .map((i) => expect(i).toBeVisible());
    });
    const expectNames = ["John A.", "Sally G.", "Mike"];
    screen.getAllByTestId("sgName").map((n, i) => {
      expect(n).toHaveTextContent(expectNames[i]);
    });
  });
});
