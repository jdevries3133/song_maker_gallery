import React from "react";
import { Context } from "Common/storybook_util";
import axios from "axios";

import { waitFor, act, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { GalleryConfig } from "./gallery_config";

jest.mock("axios");

const doRender = async ({ isEditable, isPublic }) => {
  axios.get.mockResolvedValue({
    data: { is_editable: isEditable, is_public: isPublic },
  });
  await act(async () => {
    render(
      <Context initialState={{ auth: { isAuthenticated: true, token: "foo" } }}>
        <GalleryConfig slug={1} />
      </Context>
    );
  });
};

it("renders without error", async () => {
  await doRender({ isEditable: true, isPublic: true });
  expect(screen.getByText("Gallery Settings")).toBeVisible();
});

describe("GalleryConfigPage", () => {
  it("fetches data from api", async () => {
    await doRender({ isEditable: true, isPublic: true });
    expect(axios.get).toHaveBeenCalledWith("/api/gallery/summary/1/", {
      headers: {
        Accept: "application/json",
        Authorization: "Token foo",
      },
    });
  });

  it("renders checked based on API response (allowStudentSubmissions)", async () => {
    await doRender({ isEditable: true, isPublic: false });
    await waitFor(() => {
      expect(document.getElementById("allowStudentSubmissions")).toBeChecked();
    });
  });

  it("does not render checked based on API response (allowStudentSubmissions)", async () => {
    await doRender({ isEditable: false, isPublic: false });
    await waitFor(() => {
      expect(document.getElementById("allowStudentSubmissions").checked).toBe(
        false
      );
    });
  });

  it("does not render checked based on API response (isGalleryPublished)", async () => {
    await doRender({ isEditable: true, isPublic: true });
    await waitFor(() => {
      expect(document.getElementById("isGalleryPublished")).toBeChecked();
    });
  });

  it("does not render checked based on API response (isGalleryPublished)", async () => {
    await doRender({ isEditable: true, isPublic: false });
    await waitFor(() => {
      expect(document.getElementById("isGalleryPublished").checked).toBe(false);
    });
  });
});
