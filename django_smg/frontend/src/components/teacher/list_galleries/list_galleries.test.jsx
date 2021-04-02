import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import "jest-styled-components";

import { Context as TestContext } from "Test/app_context";
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

beforeEach(() => {
  windowLocation.mockImplementation((attr) => {
    switch (attr) {
      case "origin":
        return "http://localhost:8000";
      default:
        throw new Error(`Mock implementation does not support ${attr}`);
    }
  });

  render(
    <TestContext initialState={INITIAL_STATE}>
      <ListGalleries />
    </TestContext>
  );
});

afterEach(() => {
  deleteGallery.mockClear();
  windowLocation.mockClear();
});

describe("<ListGalleries />", () => {
  it("lists user's galleries in redux state", () => {
    screen
      .queryAllByTestId("galleryName")
      .map((name, i) =>
        expect(name).toHaveTextContent(INITIAL_STATE.user.galleries[i].title)
      );
  });

  it("renders links to gallery from redux state", () => {
    screen.queryAllByTestId("viewGalleryLink").map((link, i) => {
      expect(link).toHaveAttribute(
        "href",
        `/gallery/${INITIAL_STATE.user.galleries[i].slug}/`
      );
    });
  });

  it("renders modal to confirm gallery deletion", () => {
    fireEvent.click(screen.queryAllByTestId("deleteGalleryBtn")[0]);
    expect(screen.queryByTestId("blanket")).toBeVisible();
  });

  test("confirm delete modal is dismissable", async (done) => {
    fireEvent.click(screen.queryAllByTestId("deleteGalleryBtn")[0]);
    expect(screen.queryByTestId("dismissBlanketButton")).toBeVisible();

    fireEvent.click(screen.getByTestId("dismissBlanketButton"));
    await waitFor(() => {
      expect(screen.queryByTestId("dismissBlanketButton")).toBeFalsy();
    });
    done();
  });

  it("calls redux delete action when modal button is clicked", async (done) => {
    fireEvent.click(screen.getAllByTestId("deleteGalleryBtn")[0]);
    await waitFor(() =>
      expect(screen.getByTestId("confirmDeleteBtn")).toBeVisible()
    );

    fireEvent.click(screen.getByTestId("confirmDeleteBtn"));
    expect(deleteGallery).toHaveBeenCalledWith(
      INITIAL_STATE.user.galleries[0].pk,
      INITIAL_STATE.auth.token
    );
    done();
  });

  it("unmounts modal after successful deletion", async (done) => {
    fireEvent.click(screen.getAllByTestId("deleteGalleryBtn")[0]);
    await waitFor(() =>
      expect(screen.queryByText("Are you Sure?")).toBeVisible()
    );

    fireEvent.click(screen.getByTestId("confirmDeleteBtn"));
    await waitFor(() =>
      expect(screen.queryByText("Are you Sure?")).toBeFalsy()
    );
    done();
  });
});
