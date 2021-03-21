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
import { Teacher } from "./index";

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

const setupVerify = async (spreadsheet = "test_group.csv") => {
  setupRender();
  act(() => {
    mountFile(screen.getByTestId("csvFileInput"), getTestCsv(spreadsheet));
  });
  fireEvent.click(screen.getByTestId("addSpreadsheetButton"));
  await waitFor(() => screen.findAllByTestId("verifyModalPresent"));
};

const setupAddFirstGroup = async () => {
  await setupVerify();
  act(() => {
    fireEvent.click(screen.getByTestId("verifyGroupButton"));
  });
};

describe("gallery addition process via <Teacher />", () => {
  it("mounts modal window to DOM for csv data verification", async (done) => {
    await setupVerify();
    expect(screen.getByTestId("verifyModalNormal")).toBeTruthy();
    done();
  });

  it("unmounts <Verify /> and mounts <Staged /> on first group added", async (done) => {
    await setupAddFirstGroup();
    // Click "Add Group," which unmounts <Verify /> and mounts <Staged />
    expect(screen.getByTestId("firstFileUploadedMsg")).toHaveTextContent(
      "🎉Nice!🎊"
    );
    expect(screen.queryByTestId("verifyModalNormal")).toBeFalsy();
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
      expect(screen.queryByText("Success!")).toBeVisible();
      expect(screen.getByTestId("newGalUrl")).toHaveTextContent(
        "http://localhost/gallery/test-title"
      );
    });
    done();
  });
});

// TODO: migrate this to be the test suite for <Validate />
// That cannot be done until the unnecessary entanglement between <Teacher />
// and it's children is resovled by refactoring.
describe("spreadsheet validation via <Teacher />", () => {
  it("asks for name column when it is ambiguous", async (done) => {
    await setupVerify("bad_name.csv");
    expect(screen.getByTestId("verifyModalNoName")).toBeVisible();
    const namebtn = screen.getAllByTestId("nameColChoice")[0];
    expect(namebtn).toHaveTextContent("nome");
    act(() => {
      fireEvent.click(namebtn);
    });
    await waitFor(() =>
      expect(screen.getByTestId("verifyModalNormal")).toBeVisible()
    );
    done();
  });
  it("asks for link column when it is ambiguous", async (done) => {
    await setupVerify("bad_link.csv");
    expect(screen.getByTestId("verifyModalNoLink")).toBeVisible();
    const linkbtn = screen.getAllByTestId("linkColChoice")[1];
    expect(linkbtn).toHaveTextContent("lonk");
    act(() => {
      fireEvent.click(linkbtn);
    });
    await waitFor(() =>
      expect(screen.getByTestId("verifyModalNormal")).toBeVisible()
    );
    done();
  });
  it("displays a table with student names and link previews", async (done) => {
    await setupVerify("test_group_1.csv");
    expect(screen.getByTestId("verifyModalNormal")).toBeVisible();
    expect(screen.getAllByTestId("sgName").length).toEqual(20);
    const expectNames = [
      "Avery",
      "Landon",
      "Elizabeth",
      "Gianna",
      "Evianys",
      "Maisey",
      "Patrick",
      "Abigail",
      "Jack",
      "Michael",
      "Avery",
      "Landon",
      "Elizabeth",
      "Gianna",
      "Ryder",
      "Evianys",
      "Evianys",
      "Maisey",
      "Patrick",
      "Abigail",
      "Michael",
    ];
    screen.getAllByTestId("sgName").map((n, i) => {
      expect(n).toHaveTextContent(expectNames[i]);
    });
    screen
      .getAllByTestId("sgLink")
      .map((l) =>
        expect(l).toHaveTextContent("https://musiclab.chromeexperim...")
      );
    done();
  });
});
