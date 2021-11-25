import React, { useState } from "react";
import styled from "styled-components";

import { H1 } from "Styles";

import { BreadCrumbOne } from "./part_one";
import { BreadCrumbTwo } from "./part_two";
import { BreadCrumbThree } from "./part_three";
import { GalleryLaunchComplete } from "./gallery_launch_complete";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ShadedBubble = styled.div`
  margin: 0 3px;
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 100%;
  background-color: #222;
`;

const UnShadedBubble = styled(ShadedBubble)`
  background-color: #eee;
`;

export const LaunchAutoGalleryForm = () => {
  const FORM_STEPS = [
    null, // don't ask me why I'm using 1-based indexing
    BreadCrumbOne,
    BreadCrumbTwo,
    BreadCrumbThree,
  ];
  const [formStep, setFormStep] = useState(1);
  const [galleryData, setGalleryData] = useState({});
  const onCrumbComplete = (data) => {
    setGalleryData({ ...galleryData, ...data });
    setFormStep(formStep + 1);
  };
  const CurrentForm = FORM_STEPS[formStep];
  const breadcrumbs = [];
  for (let i = 0; i < formStep; i++) {
    breadcrumbs.push(<ShadedBubble key={Math.random()} />);
  }
  for (let i = 1; i < FORM_STEPS.length - formStep; i++) {
    breadcrumbs.push(<UnShadedBubble key={Math.random()} />);
  }
  return (
    <>
      <H1 small>Create New Gallery</H1>
      {formStep < FORM_STEPS.length ? (
        <Container>
          <div>{breadcrumbs}</div>
          <div>
            <CurrentForm onCrumbComplete={onCrumbComplete} />
          </div>
        </Container>
      ) : (
        <GalleryLaunchComplete galleryData={galleryData} />
      )}
    </>
  );
};
