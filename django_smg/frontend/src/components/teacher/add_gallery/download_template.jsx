import React from "react";

export const DownloadTemplate = () => (
  <a
    style={{ textDecoration: "none" }}
    href="static/frontend/songmakergallery_upload_template.csv"
    download
  >
    <button
      className="button"
      style={{
        display: "block",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      Download Template
    </button>
  </a>
);
