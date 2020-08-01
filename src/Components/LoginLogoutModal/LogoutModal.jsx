import "../../App.css";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import Modal from "react-bootstrap/Modal";
import LogoutModalHeading from "./LogoutModalHeading.jsx";
import LogoutBody from "./LogoutBody.jsx"

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
        <Modal.Header closeButton>
          <Modal.Title>
            <LogoutModalHeading message="Logout" />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <LogoutBody />
        </Modal.Body>
      </Modal>
    );
  }
}

export default LoginModal;
