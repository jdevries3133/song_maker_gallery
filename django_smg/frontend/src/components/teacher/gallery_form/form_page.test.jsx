import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { Context as C } from "Common/storybook_util";

import { GalleryFormPage } from "./form_page";
import { usePublicGallery } from "Common/usePublicGallery";
import { GalleryForm } from "./gallery_form";

jest.mock("./gallery_form");
jest.mock("Common/usePublicGallery");
jest.mock("react-router-dom", () => {
  const rrd = jest.requireActual("react-router-dom");
  return {
    ...rrd,
    useParams: jest.fn().mockReturnValue({ slug: "slug sentinel" }),
  };
});

describe("GalleryFormPage", () => {
  it("returns a nice 404 message", () => {
    usePublicGallery.mockReturnValue({
      gallery: "sentinel",
      error: { status: 404 },
    });
    render(
      <C>
        <GalleryFormPage />
      </C>
    );
    expect(
      screen.queryByText("Gallery slug sentinel was not found.")
    ).toBeVisible();
  });
  it("notifies user of server errors", () => {
    usePublicGallery.mockReturnValue({
      gallery: "sentinel",
      error: { status: 500 },
    });
    render(
      <C>
        <GalleryFormPage />
      </C>
    );
    expect(screen.queryByText("Server error. Please try again.")).toBeVisible();
  });
  it("passes gallery to GalleryForm when all is well", () => {
    usePublicGallery.mockReturnValue({
      gallery: "sentinel",
    });
    GalleryForm.mockImplementation(({ gallery }) => <p>{gallery}</p>);
    render(
      <C>
        <GalleryFormPage />
      </C>
    );
    expect(screen.queryByText("sentinel")).toBeVisible();
  });
});
