import "../../App.css";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import Button from "react-bootstrap/Button";
import { FaQuestionCircle } from "react-icons/fa";
import LoginModal from "../LoginLogoutModal/LoginModal/LoginModal.jsx";
import LogoutModal from "../LoginLogoutModal/LogoutModal/LogoutModal.jsx";
import NameDisplay from "./NameDisplay.jsx";
import CompanyName from "./CompanyName.jsx";
import TopBarButton from "./TopBarButton.jsx";
import InfoModal from "./InfoModal.jsx";
import {BASE_URL, ASSETS, LOGO_NO_MOON} from "../../Constants.js"

@inject("store")
@observer
class TopBar extends Component {
  constructor(props) {
    super(props);
    this.handleLoginShow = this.handleLoginShow.bind(this);
    this.handleLogoutShow = this.handleLogoutShow.bind(this);
    this.handleInfoShow = this.handleInfoShow.bind(this);
  }

  handleLoginShow(e) {
    e.preventDefault();
    this.props.store.setLoginModal(true);
  }

  handleLogoutShow(e) {
    e.preventDefault();
    this.props.store.setLogoutModal(true);
  }

  handleInfoShow(e) {
    e.preventDefault();
    this.props.store.setInfoModal(true);
  }

  render() {
    const { store } = this.props;
    return (
      <div className="top-bar">
        <div className="horizontal-flex">
          <img src={BASE_URL + ASSETS + LOGO_NO_MOON} className="top-bar-logo" alt=""/>
          <CompanyName message="Feldspar" />
        </div>
        <div className="horizontal-flex">
          {!store.getLoggedIn && (
            <TopBarButton message="Login" clickFunc={this.handleLoginShow} />
          )}
          {store.getLoggedIn && (
            <div className="horizontal-flex">
              <NameDisplay username={store.getUsername} />
              <TopBarButton
                message="Logout"
                clickFunc={this.handleLogoutShow}
              />
            </div>
          )}
          <Button
            className="custom-light-button"
            variant="light"
            onClick={this.handleInfoShow}
          >
            <FaQuestionCircle />
          </Button>
        </div>

        <LoginModal />
        <LogoutModal />
        <InfoModal />
      </div>
    );
  }
}

export default TopBar;
