import React from "react";
import PropTypes from "prop-types";

import Verify from "../verify";
import { GalPostSuccess } from "./gal_post_success";
import ServerError from "../../../generics/server_error";
import { BadRequest } from "../../../generics/validation_error";
import { MissingFields } from "./missing_fields";

/**
 * Blanket elements which may be injected onto the screen:
 *
 * - <Verify />         ||  CSV data verification
 * - <BadRequest />     ||  4xx error message
 * - <ServerError />    ||  5xx error message
 * - <GalPostSuccess /> ||  2xx allOk message
 */
export const Blankets = ({ show, ...props }) => {
  switch (show) {
    case "verify":
      return <Verify {...props.verifyProps} />;
    case "badRequest":
      return <BadRequest {...props.badRequestProps} />;
    case "serverError":
      return <ServerError {...props.serverErrorProps} />;
    case "galPostSuccess":
      return <GalPostSuccess {...props.galPostSuccessProps} />;
    case "missingFields":
      return <MissingFields {...props.missingFields} />;
    default:
      return null;
  }
};

Blankets.propTypes = {
  // props for this component itself
  show: PropTypes.oneOf([
    "verify",
    "badRequest",
    "serverError",
    "missingFields",
    "galPostSuccess",
    null,
  ]),

  // props for children
  verifyProps: PropTypes.shape({
    fileInputRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
    csv: PropTypes.object,
    restart: PropTypes.func,
    groupName: PropTypes.string,
    groupNameChange: PropTypes.func,
    otherGroups: PropTypes.arrayOf(PropTypes.string),
    validatedHandler: PropTypes.func,
    nameIndex: PropTypes.number,
    linkIndex: PropTypes.number,
    indexHandler: PropTypes.func,
  }),
  missingFields: PropTypes.shape({
    blankTitleError: PropTypes.bool,
    blankDescriptionError: PropTypes.bool,
    titleValue: PropTypes.string,
    descriptionValue: PropTypes.string,
    titleInputHandler: PropTypes.func,
    descriptionInputHandler: PropTypes.func,
  }),
  badRequestProps: PropTypes.shape({
    onOk: PropTypes.func,
    serverErrorMessage: PropTypes.arrayOf(PropTypes.string),
  }),
  serverErrorProps: PropTypes.shape({ onOk: PropTypes.func }),
  galPostSuccessProps: PropTypes.shape({
    slug: PropTypes.string,
    onOk: PropTypes.func,
  }),
};
