import React from "react";
import renderer from "react-test-renderer";
import { render, cleanup, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";

import { Stage, TITLE_LENGTH_LIMIT } from "./stage";

const MOCK_STAGED_INIT = {
  titleValue: "title",
  titleInput: jest.fn(),
  descriptionValue: "description",
  descriptionInput: jest.fn(),
  groups: [[]],
  unStageGroupHandler: jest.fn(),
  confirmCreate: jest.fn(),
};

let mockStaged;

beforeEach(() => {
  mockStaged = { ...MOCK_STAGED_INIT };
});

afterEach(cleanup);

/* Helper function for rendering Stage with title of n characters */
const renderWithChars = (numChars) => {
  return {
    ...render(<Stage {...mockStaged} titleValue={"c".repeat(numChars)} />),
  };
};

describe("stage", () => {
  it("matches snapshot", () => {
    const tree = renderer.create(<Stage {...mockStaged} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("has a counter that shows current num chars entered", () => {
    const { getByTestId } = renderWithChars(60);
    expect(getByTestId("titleLenLimit")).toHaveTextContent(
      `60/${TITLE_LENGTH_LIMIT}`
    );
  });

  it("shows counter after 50 chars are entered", () => {
    const testForCharCounts = [0, 10, 20, 30, 49];
    testForCharCounts.forEach((count) => {
      const { queryByText } = renderWithChars(count);
      // counter is not in the DOM
      expect(queryByText(`${count}/${TITLE_LENGTH_LIMIT}`)).toBeFalsy();
    });
  });

  it("turns counter orange after limit - 10 exceeded", () => {
    const { getByTestId } = renderWithChars(TITLE_LENGTH_LIMIT - 10);
    expect(getByTestId("titleLenLimit")).toHaveStyle("color: orange;");
  });

  it("turns counter red after limit exceeded", () => {
    const { getByTestId } = renderWithChars(TITLE_LENGTH_LIMIT);
    expect(getByTestId("titleLenLimit")).toHaveStyle("color: red;");
  });

  it("prevents submission of title longer than 100 chars", async () => {
    const { getByTestId, getByText } = renderWithChars(101);
    await act(async () => {
      fireEvent.click(getByTestId("submit"));
    });
    expect(getByTestId("errorArray header")).toHaveTextContent(
      "Title Too Long"
    );
    expect(
      getByText(`must be less than ${TITLE_LENGTH_LIMIT}`, { exact: false })
    ).toBeTruthy();
    expect(
      getByText(`Your title is currently 101 characters long`, {
        exact: false,
      })
    ).toBeTruthy();
  });

  it("calls confirmCreate for valid data", async () => {
    const { getByTestId } = render(<Stage {...mockStaged} />);
    await act(async () => fireEvent.click(getByTestId("submit")));
    expect(mockStaged.confirmCreate).toHaveBeenCalledTimes(1);
  });
});
