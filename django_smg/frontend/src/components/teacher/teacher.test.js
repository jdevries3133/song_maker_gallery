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

/**
 * Setup funcs for each stage of the creation process.
 */

const setupRender = () => {
  render(
    <TestContext initialState={{ auth: { isAuthenticated: true } }}>
      <Teacher />
    </TestContext>
  );
};

const setupVerify = async () => {
  setupRender();
  act(() => {
    mountFile(screen.getByTestId("csvFileInput"), getTestCsv("test_group.csv"));
  });
  fireEvent.click(screen.getByTestId("addSpreadsheetButton"));
  await waitFor(() => screen.findByTestId("verifyModal"));
};

const setupAddFirstGroup = async () => {
  await setupVerify();
  act(() => {
    fireEvent.click(screen.getByTestId("verifyGroupButton"));
  });
};

describe("teacher", () => {
  it("mounts modal window to DOM for csv data verification", async (done) => {
    await setupVerify();
    expect(screen.getByTestId("verifyModal")).toBeTruthy();
    done();
  });

  it("unmounts <Verify /> and mounts <Staged /> on first group added", async (done) => {
    await setupAddFirstGroup();
    // Click "Add Group," which unmounts <Verify /> and mounts <Staged />
    expect(screen.getByTestId("firstFileUploadedMsg")).toHaveTextContent(
      "🎉Nice!🎊"
    );
    expect(screen.queryByTestId("verifyModal")).toBeFalsy();
    screen.getByText("Your Staged Gallery");
    done();
  });

  it("creates a new gallery", async (done) => {
    await setupAddFirstGroup();

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
