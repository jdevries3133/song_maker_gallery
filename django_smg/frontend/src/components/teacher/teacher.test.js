import * as fs from "fs";
import * as path from "path";
import React from "react";
import {
  act,
  render,
  fireEvent,
  screen,
  waitFor,
} from "@testing-library/react";
import { Context as TestContext } from "../../test/app_context";
import "@testing-library/jest-dom";
import Teacher from "./teacher";

jest.mock("../../actions/user");

const mountFile = (node, data = "") => {
  const file = new File([data], "group.csv", { type: "text/csv" });
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
};

describe("teacher", () => {
  // Integration test of the full gallery creation flow
  it("is possible to make a gallery", async (done) => {
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
    });

    // Trigger CSV Handler
    fireEvent.click(screen.getByTestId("addSpreadsheetButton"));

    // <Verify /> component is now mounted
    await waitFor(() => expect(screen.getByTestId("verifyModal")).toBeTruthy());

    // Click "Add Group," which unmounts <Verify /> and mounts <Staged />
    act(() => {
      fireEvent.click(screen.getByTestId("verifyGroupButton"));
    });
    expect(screen.getByTestId("firstFileUploadedMsg")).toHaveTextContent(
      "🎉Nice!🎊"
    );
    expect(screen.queryByTestId("verifyModal")).toBeFalsy();
    screen.getByText("Your Staged Gallery");

    // Input title
    act(() => {
      fireEvent.change(screen.getByTestId("titleInput"), {
        target: { value: "Test Title" },
      });
    });

    // Submit to create gallery
    act(() => {
      fireEvent.click(screen.getByTestId("submit"));
    });

    await waitFor(async () => {
      expect(screen.queryByText("Success!")).toBeTruthy();
      expect(screen.getByTestId("newGalUrl")).toHaveTextContent(
        "http://localhost/gallery/test-title"
      );
    });
    done();
  });
});
