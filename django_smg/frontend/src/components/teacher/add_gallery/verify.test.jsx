import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import Papa from "papaparse";
import { Context as TestContext } from "Common/storybook_util";
import "@testing-library/jest-dom";

import Verify from "./verify";
import { getTestCsv } from "./index.test";

const setup = (fileName, otherGroups = []) => {
  const config = {
    complete: (results) => {
      render(
        <TestContext>
          <Verify
            csv={results}
            otherGroups={otherGroups}
            indexHandler={jest.fn()}
            restart={jest.fn()}
            groupName={fileName.slice(-4)}
          />
        </TestContext>
      );
    },
  };
  Papa.parse(getTestCsv(fileName), config);
};

describe("<Verify />", () => {
  it("asks for name column when it is ambiguous", async () => {
    setup("bad_name.csv");
    expect(screen.getByTestId("verifyModalNoName")).toBeVisible();
    const namebtn = screen.getAllByTestId("nameColChoice")[0];
    expect(namebtn).toHaveTextContent("nome");
    fireEvent.click(namebtn);
    await waitFor(() =>
      expect(screen.getByTestId("verifyModalNormal")).toBeVisible()
    );
  });
  it("asks for link column when it is ambiguous", async () => {
    await setup("bad_link.csv");
    await waitFor(() => {
      expect(screen.getByTestId("verifyModalNoLink")).toBeVisible();
    });
    const linkbtn = screen.getAllByTestId("linkColChoice")[1];
    expect(linkbtn).toHaveTextContent("lonk");
    fireEvent.click(linkbtn);
    await waitFor(() =>
      expect(screen.getByTestId("verifyModalNormal")).toBeVisible()
    );
  });
  it("displays a table with student names and link previews", async () => {
    setup("test_group_1.csv");
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
  });
});
