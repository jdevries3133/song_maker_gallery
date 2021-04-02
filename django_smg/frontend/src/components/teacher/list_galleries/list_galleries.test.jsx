import React from "react";
import {
  render,
  screen,
  act,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import "jest-styled-components";

import { Context as TestContext } from "Test/app_context";
import {
  postGallery,
  deleteGallery,
  acknowledgeDelete,
  getUserGalleries,
} from "Actions/user";

import ListGalleries from "./index";

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
  render(
    <TestContext initialState={INITIAL_STATE}>
      <ListGalleries />
    </TestContext>
  );
});

afterEach(() => deleteGallery.mockClear());

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
    act(() => {
      fireEvent.click(screen.queryAllByTestId("deleteGalleryBtn")[0]);
    });
    expect(screen.queryByTestId("blanket")).toBeVisible();
  });
  test("confirm delete modal is dismissable", () => {
    act(() => {
      fireEvent.click(screen.queryAllByTestId("deleteGalleryBtn")[0]);
    });
    expect(screen.queryByTestId("dismissBlanketButton")).toBeVisible();
    act(() => {
      fireEvent.click(screen.getByTestId("dismissBlanketButton"));
    });
    waitFor(() => {
      expect(screen.queryByTestId("dismissBlanketButton")).toBeFalsy();
    });
  });
  it("calls redux delete action when modal button is clicked", () => {
    act(() => {
      fireEvent.click(screen.getAllByTestId("deleteGalleryBtn")[0]);
    });
    waitFor(() => expect(screen.getByTestId("confirmDeleteBtn")).toBeVisible());
    act(() => {
      fireEvent.click(screen.getByTestId("confirmDeleteBtn"));
    });
    expect(deleteGallery).toHaveBeenCalledWith(
      INITIAL_STATE.user.galleries[0].pk,
      INITIAL_STATE.auth.token
    );
  });
  it("unmounts modal after successful deletion", () => {
    act(() => {
      fireEvent.click(screen.getAllByTestId("deleteGalleryBtn")[0]);
    });
    waitFor(() => expect(screen.getByTestId("confirmDeleteBtn")).toBeVisible());
    act(() => {
      fireEvent.click(screen.getByTestId("confirmDeleteBtn"));
    });
    waitFor(() => expect(screen.queryByTestId("blanket")).toBeFalsy());
  });
});
