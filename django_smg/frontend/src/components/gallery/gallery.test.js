import React from "react";
import Gallery from "./gallery";

import { render, cleanup } from "@testing-library/react";
import { Context as TestContext } from "Test/app_context";
import { mockGetGallery } from "Test/__mocks__/actions";
import { getGallery } from "Actions/gallery";
import { windowLocation } from "../../util/window";

jest.mock("../../util/window");
jest.mock("Actions/gallery");

beforeEach(() => {
  windowLocation.mockImplementation(() => "/gallery/test-gallery");
});

afterEach(() => {
  cleanup();
  windowLocation.mockClear();
});

describe("Gallery", () => {
  it("redux state conflicts with window.location", () => {
    windowLocation.mockImplementation(() => "/gallery/wrongslug");
    getGallery.mockImplementation(mockGetGallery("FOUND"));
    const { getByTestId } = render(
      <TestContext>
        <Gallery />
      </TestContext>
    );
    expect(getByTestId("loading spinner")).toBeTruthy();
  });

  it("exists", () => {
    getGallery.mockImplementation(mockGetGallery("FOUND"));
    const { getByTestId } = render(
      <TestContext>
        <Gallery />
      </TestContext>
    );
    expect(getByTestId("mounted gallery body")).toBeTruthy();
  });

  it("does not exist", () => {
    getGallery.mockImplementation(mockGetGallery("NOT_FOUND"));
    const { getByText } = render(
      <TestContext>
        <Gallery />
      </TestContext>
    );
    expect(getByText("There is no gallery named test gallery")).toBeTruthy();
  });
});
