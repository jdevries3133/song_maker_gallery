import React from "react";
import { connect } from "react-redux";

import styled, { P } from "Styles";
import { dismissNotice as dismissNoticeAction } from "Actions/service_interrupt";
import { useModals } from "Common/useModals";

const Div = styled.div`
  margin-top: 0;
  background-color: yellow;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const Close = styled.button`
  @media (min-width: 700px) {
    position: absolute;
    top: 0;
    right: 0;
  }
  color: white;
  display: block;
  background-color: #f54e7a; /* matching red */
  border-radius: 100%;
  border: none;
  box-shadow: 0 0 3px #ae0000;
  cursor: pointer;

  &:hover,
  &:focus {
    background-color: lightred;
    box-shadow: none;
  }
`;

const TextWrapper = styled.div`
  position: relative;
  top: 20px;
`;

const _ServiceInterruption = ({ dismissed, dismissNotice }) => {
  const [modals, dispatchModal] = useModals({
    modals: [
      {
        name: "details",
        show: () => (
          <TextWrapper>
            <P justify>
              I am working on improving the servers that this website runs on to
              provide more capacity and also allow me to deploy new applications
              more quickly and easily. It's impossible for me to do this work
              while also keeping this website online. I could move this website
              off-site to AWS temporarily... consider making a donation with the
              donate button on the teacher page if you use this website a lot!
            </P>
            <P justify>
              Otherwise, there may be intermittent outages, especially on
              evenings and weekends (Eastern Standard Time). If you have a
              lesson or activity planned, please give me a heads up! I'm happy
              to be flexible, and the last thing I want to do is tank anyone's
              plans. It's been a joy to see this project get as much use as it
              has. Over 30,000 students have benefited from it, and I am
              extremely proud of that.
            </P>
            <P justify>
              I hope that these changes lead to a strong future for this
              application and others I might create for teachers and students.
              Please reach out to me at{" "}
              <a href="mailto:jdevries3133@gmail.com">
                jdevries3133@gmail.com{" "}
              </a>
              to let me know if there's anything you need towards supporting
              your lesson and keeping the site online!
            </P>
          </TextWrapper>
        ),
      },
    ],
  });
  return dismissed ? null : (
    <>
      {modals}
      <a
        onClick={() => dispatchModal("details")}
        aria-label="open service interruption details modal"
      >
        <Div>
          <span>
            Notice: this website may be intermittently unavailable. Click here
            for details.
          </span>
          <Close onClick={dismissNotice}>x</Close>
        </Div>
      </a>
    </>
  );
};

export const ServiceInterruption = connect(
  (state) => ({
    dismissed: state.serviceState.dismissed,
  }),
  { dismissNotice: dismissNoticeAction }
)(_ServiceInterruption);
