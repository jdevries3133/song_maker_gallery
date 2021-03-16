import React from "react";
import Gallery from "./gallery";

import { render, cleanup } from "../../test/redux_wrap";
import { mockGetGallery } from "../../test/__mocks__/actions";
import { getGallery } from "../../actions/gallery";
import { windowLocation } from "../../util/window";

jest.mock("../../util/window");
jest.mock("../../actions/gallery");

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
