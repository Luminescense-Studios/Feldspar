import "../../../App.css";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import Modal from "react-bootstrap/Modal";
import LogoutBody from "./LogoutBody.jsx";
import LogoCircle from "../LogoCircle.jsx";

@inject("store")
@observer
class LoginModal extends Component {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.props.store.setLogoutModal(false);
  }

  render() {
    const { store } = this.props;
    return (
      <Modal
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={store.showLogoutModal}
        onHide={() => this.handleClose()}
        id="logoutModal"
      >
        <Modal.Body>
          <LogoCircle />
          <div className="modal-plain-text">Confirm Log out?</div>
          <LogoutBody />
        </Modal.Body>
      </Modal>
    );
  }
}

export default LoginModal;
