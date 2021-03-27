/**
 * terms of service
 */

import React, { useState, Fragment } from "react";
import styled from "styled-components";

import { Portal } from "../common/portal";

import { TosText } from "./terms_of_service";
import { PrivacyText } from "./privacy_policy";
export { TosPage } from "./terms_of_service";
export { PrivacyPage } from "./privacy_policy";

/* Force <a> styling on anchor tags without href */
const A = styled.a`
  color: blue;
  font-weight: bold;
  text-decoration: underline;

  &:hover {
    cursor: pointer;
  }
`;

export const Tos = () => {
  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => setShowModal(!showModal);
  return (
    <Fragment>
      {showModal ? (
        <Portal>
          <TosText onOk={toggleModal} />
        </Portal>
      ) : null}
      <A onClick={toggleModal}>Terms of Service</A>
    </Fragment>
  );
};

export const Privacy = () => {
  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => setShowModal(!showModal);
  return (
    <Fragment>
      {showModal ? (
        <Portal>
          <PrivacyText onOk={toggleModal} />
        </Portal>
      ) : null}
      <A onClick={toggleModal}>Privacy Policy</A>
    </Fragment>
  );
};
