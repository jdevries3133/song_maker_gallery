import * as fs from "fs";
import * as path from "path";
import React from "react";
import { act, render, fireEvent, screen } from "@testing-library/react";
import { Context as TestContext } from "../../test/app_context";

import Teacher from "./teacher";

const mountFile = (node, data = "") => {
  const file = new File([data], "chucknorris.png", { type: "image/png" });
  fireEvent.change(node, { target: { files: [file] } });
};

const getTestCsv = (name) => {
  const rootDir = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "..",
    "..",
    "ui_testing_data"
  );
  return fs
    .readFileSync(path.join(rootDir, name), { encoding: "utf8" })
    .toString();
  return result;
};

describe("teacher", () => {
  // Integration test of the full gallery creation flow
  it("is possible to make a gallery", async () => {
    render(
      <TestContext initialState={{ auth: { isAuthenticated: true } }}>
        <Teacher />
      </TestContext>
    );
    // Upload file
    act(() => {
      mountFile(
        screen.getByTestId("csvFileInput"),
        getTestCsv("test_group.csv")
      );
      fireEvent.click(screen, "addSpreadsheetButton");
      fireEvent.click(screen, "verifyGroupButton");
    });
    expect(screen.getByTestId("firstFileUploadedMsg")).toHaveTextContent(
      "🎉Nice!🎊"
    );

    // Click "Add Group"
  });
});
