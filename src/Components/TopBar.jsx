import "../App.css";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import Button from "react-bootstrap/Button";
import LoginModal from "./LoginModal/LoginModal.jsx";

@inject("store")
@observer
class TopBar extends Component {
  constructor(props) {
    super(props);
    this.handleShow = this.handleShow.bind(this);
  }

  handleShow(e) {
    e.preventDefault();
    this.props.store.setLoginModal(true);
  }

  render() {
    const { store } = this.props;
    return (
      <div className="top-bar">
        <h2>Feldspar</h2>
        {!store.getLoggedIn && (
          <Button
            variant="link"
            className="top-bar-login-button"
            onClick={(e) => this.handleShow(e)}
          >
            Login..
          </Button>
        )}
        {store.getLoggedIn && ( <div>Hi {store.getUsername}!</div>)}
        <LoginModal />
      </div>
    );
  }
}

export default TopBar;
