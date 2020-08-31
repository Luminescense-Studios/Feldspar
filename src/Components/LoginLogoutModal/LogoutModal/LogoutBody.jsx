import "../../../App.css";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { BASE_URL_AUTH, USERS, LOGOUT } from "../../../Constants.js";
import LargeAlert from "../../LargeAlert.jsx";

@inject("store")
@observer
class LogoutBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDisabled: false,
      isError: false,
    };

    this.handleLogoutSubmit = this.handleLogoutSubmit.bind(this);
  }

  async handleLogoutSubmit(e) {
    e.preventDefault();

    this.setState({ isDisabled: true });
    const payload = {
      token: this.props.store.getRefreshToken,
    };

    try {
      await axios.post(BASE_URL_AUTH + USERS + LOGOUT, payload);
      this.setState({
        isError: false,
        isDisabled: true,
      });

      this.props.store.setUsername("");
      this.props.store.setAccessToken("");
      this.props.store.setRefreshToken("");
      this.props.store.setLoggedIn(false);

      this.props.store.setLogoutModal(false);
    } catch (e) {
      if (e.response === undefined) {
        console.log(e);
      } else if (
        e.response.status === 401 ||
        e.response.status === 403 ||
        e.response.status === 500
      ) {
        this.setState({
          isError: true,
          isDisabled: false,
        });
      } else {
        this.setState({
          isError: true,
          isDisabled: false,
        });
      }
    }
  }

  render() {
    return (
      <div className="vertical-container">
        <Button
          variant="danger"
          className="login-submit-button"
          disabled={this.state.isDisabled}
          onClick={(e) => {
            this.handleLogoutSubmit(e);
          }}
        >
          Logout
        </Button>
        {this.state.isError && (
          <LargeAlert message="Some ErrorOcurred" variant="danger" />
        )}
      </div>
    );
  }
}

export default LogoutBody;
