import React from "react";
import renderer from "react-test-renderer";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import "jest-styled-components";

import { EditableTile } from "./editable_tile";

beforeEach(() => {
  render(
    <EditableTile
      name="Frank G."
      link="https://musiclab.chromeexperiments.com/Song-Maker/song/6594803161104384"
    />
  );
});

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

  it("only shows submit button after changes to name are made", async (done) => {
    expect(screen.queryByTestId("submit")).toBeNull();
    fireEvent.change(screen.queryByTestId("nameInput"), {
      target: { value: "different" },
    });
    await waitFor(() => expect(screen.queryByTestId("submit")).toBeVisible());
    done();
  });

  it("only shows submit button after changes to link are made", async (done) => {
    expect(screen.queryByTestId("submit")).toBeNull();
    fireEvent.change(screen.queryByTestId("linkInput"), {
      target: { value: "different" },
    });
    await waitFor(() => expect(screen.queryByTestId("submit")).toBeVisible());
    done();
  });

  it("does not allow invalid link submission", () => {
    // TODO: make sure the #e41000ux action is not called here once the component
    // is hooked up
  });

  describe("link validation", () => {
    const changeTo = (link) => {
      fireEvent.change(screen.getByTestId("linkInput"), {
        target: { value: link },
      });
    };

    const linkInput = () => screen.getByTestId("linkInput");

    it("validates domain", async (done) => {
      expect(linkInput()).toHaveStyle({ border: "1px solid #ccc" });
      changeTo(
        "https://musiclb.chromeexperiments.com/Song-Maker/song/6594803161104384"
      );
      await waitFor(() => {
        expect(screen.getByText("Link is not valid")).toBeVisible();
        expect(linkInput()).toHaveStyle({ border: "2px solid #e41000" });
      });
      done();
    });
    it("validates path", async (done) => {
      expect(linkInput()).toHaveStyle({ border: "1px solid #ccc" });
      changeTo(
        "https://musiclab.chromeexperiments.com/Song-Maker/embed/6594803161104384"
      );
      await waitFor(() => {
        expect(screen.getByText("Link is not valid")).toBeVisible();
        expect(linkInput()).toHaveStyle({ border: "2px solid #e41000" });
      });
      done();
    });
    it("validates id", async (done) => {
      expect(linkInput()).toHaveStyle({ border: "1px solid #ccc" });
      changeTo(
        "https://musiclab.chromeexperiments.com/Song-Maker/embed/6594a03161104384"
      );
      await waitFor(() => {
        expect(screen.getByText("Link is not valid")).toBeVisible();
        expect(linkInput()).toHaveStyle({ border: "2px solid #e41000" });
      });
      done();
    });
  });
});
