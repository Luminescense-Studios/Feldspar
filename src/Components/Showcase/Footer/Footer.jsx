import "../Showcase.css";
import React, { Component } from "react";
import {
  FaEnvelope,
  FaInstagram,
  FaBehance,
  FaLinkedinIn,
  FaFacebookF,
  FaGithub,
} from "react-icons/fa";
import {
  EMAIL,
  INSTAGRAM_PAGE,
  FACEBOOK_PAGE,
  BEHANCE_PAGE,
  LINKEDIN_PAGE,
  GITHUB_PAGE,
  INSTAGRAM_OUTBOUND,
  FACEBOOK_OUTBOUND,
  BEHANCE_OUTBOUND,
  GITHUB_OUTBOUND,
  LINKEDIN_OUTBOUND,
} from "../../../Constants.js";
import ReactGA from "react-ga";
import { inject, observer } from "mobx-react";

@inject("store")
@observer
class Footer extends Component {
  render() {
    // const { store } = this.props;
    return (
      <div>
        {/* ======= Footer ======= */}
        <footer id="footer">
          <div className="container d-md-flex py-4">
            <div className="mr-md-auto text-left text-md-left">
              <h3 style={{ marginBottom: "0" }}>Feldspar</h3>{" "}
              <p>Handmade Software</p>
              <p>
                <strong>
                  <FaEnvelope /> Email:
                </strong>{" "}
                {EMAIL}
                <br></br>
              </p>
              <div className="copyright">
                &copy; Copyright
                <strong>
                  <span> Feldspar</span>
                </strong>
                . All Rights Reserved
              </div>
            </div>

            <div className="social-links text-center text-md-right pt-3 pt-md-0">
              <ReactGA.OutboundLink
                eventLabel={INSTAGRAM_OUTBOUND}
                to={INSTAGRAM_PAGE}
                target="_blank"
              >
                <FaInstagram />
              </ReactGA.OutboundLink>
              <ReactGA.OutboundLink
                eventLabel={FACEBOOK_OUTBOUND}
                to={FACEBOOK_PAGE}
                target="_blank"
              >
                <FaFacebookF />
              </ReactGA.OutboundLink>
              <ReactGA.OutboundLink
                eventLabel={LINKEDIN_OUTBOUND}
                to={LINKEDIN_PAGE}
                target="_blank"
              >
                <FaLinkedinIn />
              </ReactGA.OutboundLink>
              <ReactGA.OutboundLink
                eventLabel={BEHANCE_OUTBOUND}
                to={BEHANCE_PAGE}
                target="_blank"
              >
                <FaBehance />
              </ReactGA.OutboundLink>
              <ReactGA.OutboundLink
                eventLabel={GITHUB_OUTBOUND}
                to={GITHUB_PAGE}
                target="_blank"
              >
                <FaGithub />
              </ReactGA.OutboundLink>
            </div>
          </div>
        </footer>
        {/* End Footer */}
      </div>
    );
  }
}

export default Footer;
