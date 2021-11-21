import React from "react";
import renderer from "react-test-renderer";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import "jest-styled-components";

import { EditableTile } from "./editable_tile";

const onSave = jest.fn();

beforeEach(() => {
  render(
    <EditableTile
      name="Frank G."
      link="https://musiclab.chromeexperiments.com/Song-Maker/song/6594803161104384"
      onSave={onSave}
    />
  );
});

afterEach(() => onSave.mockClear());

describe("<EditableTile />", () => {
  it("matches snapshot", () => {
    expect(
      renderer
        .create(
          <EditableTile
            name="Frank G."
            link="https://musiclab.chromeexperiments.com/Song-Maker/song/6594803161104384"
          />
        )
        .toJSON()
    ).toMatchSnapshot();
  });

  it("doesn't show submit button without name", () => {
    fireEvent.change(screen.queryByTestId("linkInput"), {
      target: { value: "different" },
    });
    fireEvent.change(screen.queryByTestId("nameInput"), {
      target: { value: "" },
    });
    expect(screen.queryByText("Please enter your name.")).toBeVisible();
    expect(onSave).toHaveBeenCalledTimes(0);
  });

  it("calls passed func if data is valid", () => {
    fireEvent.change(screen.queryByTestId("linkInput"), {
      target: {
        value:
          "https://musiclab.chromeexperiments.com/Song-Maker/song/1234567812345678",
      },
    });
    fireEvent.click(screen.queryByTestId("submit"));
    expect(onSave).toHaveBeenCalledWith("Frank G.", "1234567812345678");
  });

  describe("link validation", () => {
    const changeTo = (link) => {
      fireEvent.change(screen.getByTestId("linkInput"), {
        target: { value: link },
      });
    };

    const linkInput = () => screen.getByTestId("linkInput");

    it("validates domain", async () => {
      expect(linkInput()).toHaveStyle({ border: "1px solid #ccc" });
      changeTo(
        "https://musiclb.chromeexperiments.com/Song-Maker/song/6594803161104384"
      );
      await waitFor(() => {
        expect(screen.getByText("Link is not valid")).toBeVisible();
        expect(linkInput()).toHaveStyle({ border: "2px solid #e41000" });
      });
    });
    it("validates path", async () => {
      expect(linkInput()).toHaveStyle({ border: "1px solid #ccc" });
      changeTo(
        "https://musiclab.chromeexperiments.com/Song-Maker/embed/6594803161104384"
      );
      await waitFor(() => {
        expect(screen.getByText("Link is not valid")).toBeVisible();
        expect(linkInput()).toHaveStyle({ border: "2px solid #e41000" });
      });
    });
    it("validates id", async () => {
      expect(linkInput()).toHaveStyle({ border: "1px solid #ccc" });
      changeTo(
        "https://musiclab.chromeexperiments.com/Song-Maker/embed/6594a03161104384"
      );
      await waitFor(() => {
        expect(screen.getByText("Link is not valid")).toBeVisible();
        expect(linkInput()).toHaveStyle({ border: "2px solid #e41000" });
      });
    });
    it("trims whitespace", async () => {
      expect(linkInput()).toHaveStyle({ border: "1px solid #ccc" });
      changeTo(
        "    https://musiclab.chromeexperiments.com/Song-Maker/song/6594803161104384    "
      );
      await waitFor(() => {
        expect(screen.queryByText("Link is not valid")).toBeNull();
        expect(linkInput()).toHaveStyle({ border: "1px solid #ccc" });
      });
    });
  });
});
