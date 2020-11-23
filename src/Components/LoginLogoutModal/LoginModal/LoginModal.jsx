import "../../../App.css";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import Modal from "react-bootstrap/Modal";
import { Tabs, Tab } from "react-bootstrap";
import LoginForm from "./LoginForm.jsx";
import SignupForm from "./SignupForm.jsx";
import LoginWithGoogle from "./LoginWithGoogle/LoginWithGoogle.jsx";
// import LoginWithFacebook from "./LoginWithFacebook/LoginWithFacebook.jsx";

@inject("store")
@observer
class LoginModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key: "login",
    };
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.props.store.setLoginModal(false);
  }

  componentDidMount() {}

  render() {
    const { store } = this.props;
    return (
      <Modal
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={store.showLoginModal}
        onHide={() => this.handleClose()}
        id="loginModal"
      >
        <Modal.Body>
          <div className="login-form-space">
            <LoginWithGoogle />
            {/* <LoginWithFacebook /> */}
            <Tabs
              variant="pills"
              activeKey={this.state.key}
              onSelect={(k) => {
                this.setState({ key: k });
              }}
            >
              <Tab
                tabClassName="login-modal-tab"
                eventKey="login"
                title="Login"
              >
                <LoginForm />
              </Tab>
              <Tab
                tabClassName="login-modal-tab"
                eventKey="signup"
                title="Sign Up"
              >
                <SignupForm />
              </Tab>
            </Tabs>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}

export default LoginModal;
