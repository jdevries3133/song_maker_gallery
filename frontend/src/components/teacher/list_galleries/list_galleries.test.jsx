import React from "react";
import {
  act,
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import "jest-styled-components";

import { Context as TestContext } from "Common/storybook_util";
import { deleteGallery } from "Actions/user";
import { windowLocation } from "../../../util/window";

import ListGalleries from "./index";

jest.mock("../../../util/window");
jest.mock("Actions/user");
jest.mock("Actions/auth.action");

const INITIAL_STATE = {
  user: {
    galleries: [
      {
        title: "Gallery 1",
        description: "This is the description for gallery 1",
        slug: "gallery-1",
        pk: 1,
      },
      {
        title: "Gallery 2",
        description: "Th1s is the description for gallery 2",
        slug: "gallery-2",
        pk: 2,
      },
    ],
  },
  auth: { token: "testtoken" },
};

beforeEach(async () => {
  windowLocation.mockImplementation((attr) => {
    switch (attr) {
      case "origin":
        return "http://localhost:8000";
      default:
        throw new Error(`Mock implementation does not support ${attr}`);
    }
  });

  act(() => {
    render(
      <TestContext initialState={INITIAL_STATE}>
        <ListGalleries />
      </TestContext>
    );
  });
});

afterEach(() => {
  deleteGallery.mockClear();
  windowLocation.mockClear();
});

describe("<ListGalleries />", () => {
  it("lists user's galleries in redux state", () => {
    // these come from src/actions/__mocks__/user.js
    const expect_names = ["Gallery", "Other Gallery", "My Gallery"];
    screen
      .queryAllByTestId("galleryName")
      .map((name, i) =>
        expect(name).toHaveTextContent(`/gallery/${expect_names[i]}/`)
      );
  });

  it("renders links to gallery from redux state", () => {
    // these come from src/actions/__mocks__/user.js
    const expect_slugs = ["gallery-1", "other-gallery", "my-gallery"];
    screen.queryAllByTestId("viewGalleryLink").map((link, i) => {
      expect(link).toHaveAttribute("href", `/gallery/${expect_slugs[i]}/`);
    });
  });

  it("renders modal to confirm gallery deletion", () => {
    fireEvent.click(screen.queryAllByTestId("deleteGalleryBtn")[0]);
    expect(screen.queryByTestId("blanket")).toBeVisible();
    expect(screen.queryByText("Are you sure?")).toBeVisible();
    // The gallery will no longer be available at...
    expect(screen.queryByTestId("lastChanceLink")).toHaveTextContent(
      "http://localhost:8000/gallery/gallery-1/"
    );
    expect(screen.queryByTestId("lastChanceLink")).toHaveAttribute(
      "href",
      "http://localhost:8000/gallery/gallery-1/"
    );
  });

  test("confirm delete modal is dismissable", async () => {
    fireEvent.click(screen.queryAllByTestId("deleteGalleryBtn")[0]);
    expect(screen.queryByTestId("dismissBlanketButton")).toBeVisible();

    fireEvent.click(screen.getByTestId("dismissBlanketButton"));
    await waitFor(() => {
      expect(screen.queryByTestId("dismissBlanketButton")).toBeFalsy();
    });
  });

  it("calls redux delete action when modal button is clicked", async () => {
    fireEvent.click(screen.getAllByTestId("deleteGalleryBtn")[0]);
    await waitFor(() =>
      expect(screen.getByTestId("confirmDeleteBtn")).toBeVisible()
    );

    fireEvent.click(screen.getByTestId("confirmDeleteBtn"));
    expect(deleteGallery).toHaveBeenCalledWith(
      INITIAL_STATE.user.galleries[0].pk,
      INITIAL_STATE.auth.token
    );
  });

  it("unmounts modal after successful deletion", async () => {
    fireEvent.click(screen.getAllByTestId("deleteGalleryBtn")[0]);
    await waitFor(() =>
      expect(screen.queryByText("Are you sure?")).toBeVisible()
    );

    fireEvent.click(screen.getByTestId("confirmDeleteBtn"));
    expect(deleteGallery).toHaveBeenCalled();
  });
});
