import React from "react";
import styled from "styled-components";

import { Button } from "../../../common/styles";

/**
 * For button wrapped in anchor tag.
 */
const A = styled.a`
  text-decoration: none;
`;

export const DownloadTemplate = () => (
  <A href="static/frontend/songmakergallery_upload_template.csv" download>
    <Button>Download Template</Button>
  </A>
);
