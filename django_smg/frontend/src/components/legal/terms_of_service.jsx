import React from "react";
import { Link } from "react-router-dom";

import styled, { Button, Div, Blanket, Description } from "Styles";

export const LegalContainer = styled(Div)`
  margin: 3%;
  margin-bottom: 5rem;
  & > * {
    text-align: justify;
  }
  & > * > * {
    margin-bottom: 1rem;
  }
  @media (max-width: 750px) {
    & > h1 {
      font-size: 36px;
    }
  }
`;

const TosContent = (props) => (
  <LegalContainer>
    <h1>Terms of Service</h1>
    <p>Updated 01/2021</p>
    <p>
      Also see our <Link to="/privacy/">privacy policy</Link>
    </p>
    <ol>
      <li>
        These terms constitute an agreement between the maintainer or
        representatives of this website, and any individual who has either
        registered an account or made a donation to support this website.
      </li>
      <li>
        This Agreement shall be governed by the laws of the State of New Jersey
      </li>
      <li>
        The user hereby acknowledges that they will not upload any personally
        identifying information of any individual under thirteen years of age as
        defined in the Children's Online Privacy Protection Rule ("COPPA"). The
        user furthermore agrees that they will not upload any personally
        identifying information of any minor whatsoever without the
        authorization to do so.
      </li>
      <li>
        By accepting this agreement, you acknowledge that you are at least 18
        years old.
      </li>
      <li>
        Any and all donations provided through PayPal to support this website
        are non-refundable. No expectation of goods, services, gifts, or
        benefits otherwise should be expected upon the submission of a donation
        through PayPal. Any premium features of this site must be purchased
        explicitly, and will not be rendered as the result of a PayPal donation.
      </li>
      <li>
        Users should be aware that this website is the hobby project of an
        individual who is neither a full-time web developer, nor a professional
        software engineer, nor a lawyer. The sole maintainer of this website is
        a music teacher with no amateur knowledge of many of the components that
        comprise this website. As such, all users (including users who have paid
        for premium features), should hold a reasonable expectation of site
        outage and service inavalibility.
      </li>
      <li>
        Refunds for any premium service which this site provides will be
        provided at the sole discretion of the maintainer of this website. In
        the case that a software malfunction, site outage, or other unplanned
        mistake cause the prolonged and significant interruption to a service
        that the user has paid for, the maintainer of this site
        <b>will make a reasonable effort to provide a refund.</b>
        HOWEVER, the user should note the fifth term of this agreement prior to
        purchasing any service that this website provides and consider the
        possibility that
        <b>
          even in the case of a prolonged service interruption, it is possible
          that this website can not or will not provide a refund.
        </b>
      </li>
      <li>
        The website is provided "as is without warranty of any kind, express or
        implied, including but not limited to the warranties of merchantability,
        fitness for a particular purpose and noninfringement. In no event shall
        the authors or copyright holders be liable for any claim, damages or
        other liability, whether in an action of contract, tort or otherwise,
        arising from, out of or in connection with the website or the use or
        other dealings in the website.
      </li>
      <li>
        User accounts may be terminated at any time for any reason. Likewise,
        individuals may be blocked from this website at any time for any reason
        and by any means.
      </li>
    </ol>
    <p>
      {" "}
      <a href="mailto:songmakergallery@gmail.com">Contact Us</a> with any
      questions or concerns about this policy.
    </p>
    {props.okButton ? props.okButton : null}
  </LegalContainer>
);

/* Free-standing page content */
export const TosPage = () => {
  return (
    <Description>
      <TosContent />
    </Description>
  );
};

/* modal with close button */
export const TosText = ({ onOk }) => {
  return (
    <Blanket>
      <TosContent
        okButton={
          <Button color="salmon" onClick={() => onOk()}>
            Close
          </Button>
        }
      />
    </Blanket>
  );
};
