import React from "react";
import Gallery from "./gallery";

import { render, cleanup } from "../../test/redux_wrap";
import { mockGetGallery } from "../../test/fixtures";
import { getPathName } from "./getPathName";
import { getGallery } from "../../actions/gallery";

jest.mock("./getPathName");
jest.mock("../../actions/gallery");

beforeEach(() => {
  getPathName.mockImplementation(() => "/gallery/test-gallery");
});

afterEach(() => {
  cleanup();
  getPathName.mockClear();
});

describe("Gallery", () => {
  it("redux state conflicts with window.location", () => {
    getPathName.mockImplementation(() => "/gallery/wrongslug");
    getGallery.mockImplementation(mockGetGallery("FOUND"));
    const { getByTestId } = render(<Gallery />);
    expect(getByTestId("loading spinner")).toBeTruthy();
  });

  it("exists", () => {
    getGallery.mockImplementation(mockGetGallery("FOUND"));
    const { getByTestId } = render(<Gallery />);
    expect(getByTestId("mounted gallery body")).toBeTruthy();
  });

  it("does not exist", () => {
    getGallery.mockImplementation(mockGetGallery("NOT_FOUND"));
    const { getByText } = render(<Gallery />);
    expect(getByText("There is no gallery named test gallery")).toBeTruthy();
  });
});
