import React from "react";

import styled, { H2, css } from "Styles";

const Container = styled.div`
  padding: clamp(10px, 4vw, 20px);
`;

const DonateHeader = styled(H2)`
  background-color: rgba(217, 157, 255, 0.81);
`;

const P = styled.p`
  text-align: justify;

  ${(props) =>
    props.signature &&
    css`
      text-align: right;
      margin: 0;
    `}
`;

const Signature = styled.div`
  width: 178px;
  display: inline-block;
  @media (max-width: 606px) {
    margin-top: 30px;
  }
`;

const Footer = styled.footer`
  @media (max-width: 606px) {
    text-align: right;
  }
`;

const donation = () => {
  return (
    <Container>
      <div
        style={{ display: "inline-block", textAlign: "center", width: "100%" }}
      >
        <DonateHeader>Donate!</DonateHeader>
      </div>
      <div>
        <P>
          This website was built by me, a music teacher from New Jersey, as a
          way for me to feature the amazing compositions of my own students as
          this unusual school year draws to a close.
        </P>
        <P>
          I've worked very hard to make it possible for anyone to make an
          account and create a gallery for their students completely free of
          charge. This involved creating an entire backend infrastructure behind
          this website, including account management, and a custom solution for
          automatically generating the thumbnails of student work that you see
          on this website.
        </P>
        <P>
          Although this site is free to use, it is not free to operate; and{" "}
          <strong>
            without generous donors, that money is coming from my own pocket.
          </strong>{" "}
          If you are fortunate enough to be able to chip in and support this
          project, please do!
        </P>
        <P>
          Any proceeds in excess of the cost of running this website will be
          used to support music education directly.
        </P>
      </div>
      <Footer>
        <form
          action="https://www.paypal.com/cgi-bin/webscr"
          method="post"
          target="_top"
          style={{ display: "inline-block" }}
        >
          <input type="hidden" name="cmd" value="_donations" />
          <input
            type="hidden"
            name="business"
            value="songmakergallery@gmail.com"
          />
          <input type="hidden" name="item_name" value="Support Our Website" />
          <input type="hidden" name="currency_code" value="USD" />
          <input
            type="image"
            src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif"
            border="0"
            name="submit"
            title="PayPal - The safer, easier way to pay online!"
            alt="Donate with PayPal button"
          />
          <img
            alt=""
            border="0"
            src="https://www.paypal.com/en_US/i/scr/pixel.gif"
            width="1"
            height="1"
          />
        </form>

        <Signature>
          <P signature>Thanks,</P>
          <P signature>The SMG Team</P>
        </Signature>
      </Footer>
    </Container>
  );
};

export default donation;
