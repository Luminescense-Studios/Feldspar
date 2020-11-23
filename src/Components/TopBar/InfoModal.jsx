import "../../App.css";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  FaInfoCircle,
  FaInbox,
  FaInstagram,
  FaBehance,
  FaLinkedinIn,
  FaFacebookF,
  FaGithub,
} from "react-icons/fa";
import {
  EMAIL,
  INSTAGRAM_HANDLE,
  INSTAGRAM_PAGE,
  FACEBOOK_HANDLE,
  FACEBOOK_PAGE,
  BEHANCE_HANDLE,
  BEHANCE_PAGE,
  LINKEDIN_HANDLE,
  LINKEDIN_PAGE,
  GITHUB_HANDLE,
  GITHUB_PAGE,
  INSTAGRAM_OUTBOUND,
  FACEBOOK_OUTBOUND,
  BEHANCE_OUTBOUND,
  GITHUB_OUTBOUND,
  LINKEDIN_OUTBOUND,
} from "../../Constants.js";
import Modal from "react-bootstrap/Modal";
import ReactGA from "react-ga";

@inject("store")
@observer
class LoginModal extends Component {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.props.store.setInfoModal(false);
  }

  render() {
    const { store } = this.props;
    return (
      <Modal
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={store.showInfoModal}
        onHide={() => this.handleClose()}
        id="infoModal"
      >
        <Modal.Body>
          <div className="login-form-space">
            <h2>
              <FaInfoCircle /> About
            </h2>
            <hr className="small-underline" />
            <div className="info-text">
              <p>
                Create and share 3D design of home interiors in a quick and easy
                way. Share designs with clients with a single link which can be
                viewed on all devices without downloading any plugins. Allows
                for great flexibility in a post COVID work environment. <br />
                We support custom wall and floor textures and 3D models of
                furniture uploaded to your account exclusively.
                <br />
                <br />
              </p>
              <div className="inbox-container">
                <div className="inbox">
                  <FaInbox />
                </div>
                {EMAIL}
              </div>
              <div className="social-media-container">
                <div className="social-media-cell">
                  <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip>{INSTAGRAM_HANDLE}</Tooltip>}
                  >
                    <ReactGA.OutboundLink
                      eventLabel={INSTAGRAM_OUTBOUND}
                      to={INSTAGRAM_PAGE}
                      target="_blank"
                    >
                      <div className="social-media-button">
                        <div className="social-media-icon">
                          <FaInstagram />
                        </div>
                      </div>
                    </ReactGA.OutboundLink>
                  </OverlayTrigger>
                </div>
                <div className="social-media-cell">
                  <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip>{FACEBOOK_HANDLE}</Tooltip>}
                  >
                    <ReactGA.OutboundLink
                      eventLabel={FACEBOOK_OUTBOUND}
                      to={FACEBOOK_PAGE}
                      target="_blank"
                    >
                      <div className="social-media-button">
                        <div className="social-media-icon">
                          <FaFacebookF />
                        </div>
                      </div>
                    </ReactGA.OutboundLink>
                  </OverlayTrigger>
                </div>
                <div className="social-media-cell">
                  <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip>{LINKEDIN_HANDLE}</Tooltip>}
                  >
                    <ReactGA.OutboundLink
                      eventLabel={LINKEDIN_OUTBOUND}
                      to={LINKEDIN_PAGE}
                      target="_blank"
                    >
                      <div className="social-media-button">
                        <div className="social-media-icon">
                          <FaLinkedinIn />
                        </div>
                      </div>
                    </ReactGA.OutboundLink>
                  </OverlayTrigger>
                </div>
                <div className="social-media-cell">
                  <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip>{BEHANCE_HANDLE}</Tooltip>}
                  >
                    <ReactGA.OutboundLink
                      eventLabel={BEHANCE_OUTBOUND}
                      to={BEHANCE_PAGE}
                      target="_blank"
                    >
                      <div className="social-media-button">
                        <div className="social-media-icon">
                          <FaBehance />
                        </div>
                      </div>
                    </ReactGA.OutboundLink>
                  </OverlayTrigger>
                </div>
                <div className="social-media-cell">
                  <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip>{GITHUB_HANDLE}</Tooltip>}
                  >
                    <ReactGA.OutboundLink
                      eventLabel={GITHUB_OUTBOUND}
                      to={GITHUB_PAGE}
                      target="_blank"
                    >
                      <div className="social-media-button">
                        <div className="social-media-icon">
                          <FaGithub />
                        </div>
                      </div>
                    </ReactGA.OutboundLink>
                  </OverlayTrigger>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}

export default LoginModal;
