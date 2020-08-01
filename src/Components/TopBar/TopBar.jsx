import "../../App.css";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import LoginModal from "../LoginLogoutModal/LoginModal.jsx";
import LogoutModal from "../LoginLogoutModal/LogoutModal.jsx";
import NameDisplay from "./NameDisplay.jsx";
import CompanyName from "./CompanyName.jsx";
import TopBarButton from "./TopBarButton.jsx";

@inject("store")
@observer
class TopBar extends Component {
  constructor(props) {
    super(props);
    this.handleLoginShow = this.handleLoginShow.bind(this);
    this.handleLogoutShow = this.handleLogoutShow.bind(this);
  }

  handleLoginShow(e) {
    e.preventDefault();
    this.props.store.setLoginModal(true);
  }

  handleLogoutShow(e) {
    e.preventDefault();
    this.props.store.setLogoutModal(true);
  }

  render() {
    const { store } = this.props;
    return (
      <div className="top-bar">
        <CompanyName message="Feldspar" />
        {!store.getLoggedIn && (
          <TopBarButton message="Login" clickFunc={this.handleLoginShow} />
        )}
        {store.getLoggedIn && (
          <div className="horizontal-flex">
            <NameDisplay username={store.getUsername} />
            <TopBarButton message="Logout" clickFunc={this.handleLogoutShow} />
          </div>
        )}
        <LoginModal />
        <LogoutModal />
      </div>
    );
  }
}

export default TopBar;
