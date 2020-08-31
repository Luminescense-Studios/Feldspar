import "../../App.css";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { FaInfoCircle, FaEnvelope } from "react-icons/fa";
import Modal from "react-bootstrap/Modal";

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
            <p className="info-text">
              Create and share 3D design of home interiors in a quick and easy
              way. Share designs with clients with a single link which can be
              viewed on all devices without downloading any plugins. Allows for
              great flexibility in a post COVID work environment. <br />
              We support custom wall and floor textures and 3D models of
              furniture uploaded to your account exclusively.
              <br />
              <br />
              <p style={{ "font-weight": "600" }}>
                <FaEnvelope /> luminescence.feldspar@gmail.com
              </p>
            </p>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}

export default LoginModal;
