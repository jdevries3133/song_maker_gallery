import React from "react";

import { useModals } from "Common/useModals";

import DonateButton from "./donate_button";
import DonateModal from "./donate";

export const Donate = () => {
  const [modal, dispatchModal] = useModals({
    modals: [
      {
        name: "donateModal",
        show: DonateModal,
      },
    ],
  });

  return (
    <>
      {modal}
      <DonateButton onClick={() => dispatchModal("donateModal")}>
        $
      </DonateButton>
    </>
  );
};
