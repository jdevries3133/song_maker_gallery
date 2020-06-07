import React from "react";

export const reset = (props) => {
  return (
    <div>
      <h1>Uh oh!</h1>
      <div className="description">
        <p>
          When I said this site was built by a music teacher alone, I wasn't
          kidding. Password reset functionality is complicated and hard, and I
          really wanted to get this site out by June. If you've forgotten your
          password, just make a new account. You can use a new username with the
          same email address.
        </p>
        <p>
          If, for whatever reason, you absolutely must delete your account or
          remove a public gallery, send me an email at{" "}
          <a href="mailto:songmakergallery@gmail.com">
            songmakergallery@gmail.com
          </a>
          , and I will take care of it manually as quickly as I can.
        </p>
      </div>
    </div>
  );
};

export default reset;
