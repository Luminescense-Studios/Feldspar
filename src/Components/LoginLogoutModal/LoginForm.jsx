import "../../App.css";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import Button from "react-bootstrap/Button";
import { validateEmail, parseJwt } from "../../Utils/Utils";
import axios from "axios";
import { BASE_URL_AUTH, USERS, LOGIN } from "../../Constants.js";
import SmallAlert from "./SmallAlert.jsx";
import LargeAlert from "./LargeAlert.jsx";

@inject("store")
@observer
class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginEmailValue: "",
      loginPasswordValue: "",
      loginEmailFormatError: false,

      isDisabled: false,

      isEmailExists: true,
      isPasswordCorrect: true,
      isError: false,
    };

    this.handleLoginEmailChange = this.handleLoginEmailChange.bind(this);
    this.handleLoginPasswordChange = this.handleLoginPasswordChange.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
  }

  handleLoginEmailChange(e) {
    if (!validateEmail(e.target.value)) {
      this.setState({ loginEmailFormatError: true });
    } else {
      this.setState({ loginEmailFormatError: false });
    }
    this.setState({ loginEmailValue: e.target.value });
  }

  handleLoginPasswordChange(e) {
    this.setState({ loginPasswordValue: e.target.value });
  }

  async handleLoginSubmit(e) {
    e.preventDefault();
    if (
      !this.state.loginEmailFormatError &&
      this.state.loginEmailValue !== "" &&
      this.state.loginPasswordValue !== ""
    ) {
      this.setState({ isDisabled: true });
      const user = {
        email: this.state.loginEmailValue,
        password: this.state.loginPasswordValue,
      };

      try {
        let res = await axios.post(BASE_URL_AUTH + USERS + LOGIN, user);
        this.setState({
          isError: false,
          isEmailExists: true,
          isPasswordCorrect: true,
          isDisabled: true,
        });

        const loggedInUser = parseJwt(res.data.accessToken);
        
        this.props.store.setUsername(loggedInUser.name);
        this.props.store.setAccessToken(res.data.accessToken);
        this.props.store.setRefreshToken(res.data.refreshToken);
        this.props.store.setLoggedIn(true);

        this.props.store.setLoginModal(false);
      } catch (e) {
        if (e.response === undefined) {
          console.log(e);
        } else if (e.response.status === 400) {
          this.setState({
            isError: false,
            isEmailExists: false,
            isPasswordCorrect: true,
            isDisabled: false,
          });
        } else if (e.response.status === 401) {
          this.setState({
            isError: false,
            isEmailExists: true,
            isPasswordCorrect: false,
            isDisabled: false,
          });
        } else {
          this.setState({
            isError: true,
            isEmailExists: true,
            isPasswordCorrect: true,
            isDisabled: false,
          });
        }
      }
    }
  }

  render() {
    return (
      <div className="vertical-container">
        <form
          className="login-form"
          onSubmit={(e) => {
            this.handleLoginSubmit(e);
          }}
        >
          {this.state.loginEmailFormatError && (
            <SmallAlert message="invalid Email" variant="danger" />
          )}
          <input
            placeholder="example@xyz.com"
            variant="secondary"
            size="sm"
            type="email"
            value={this.state.loginEmailValue}
            onChange={(e) => {
              this.handleLoginEmailChange(e);
            }}
            className="login-form-input"
          />

          <input
            placeholder="password"
            variant="secondary"
            size="sm"
            type="password"
            value={this.state.loginPasswordValue}
            onChange={(e) => {
              this.handleLoginPasswordChange(e);
            }}
            className="login-form-input"
          />

          <Button variant="danger" className="login-submit-button" disabled={this.state.isDisabled} type="submit">
            Login
          </Button>
        </form>

        {!this.state.isEmailExists && (
          <LargeAlert message="Email is not registered" variant="danger" />
        )}
        {this.state.isError && (
          <LargeAlert message="Some ErrorOcurred" variant="danger" />
        )}
        {!this.state.isPasswordCorrect && (
          <LargeAlert message="Password Incorrect" variant="danger" />
        )}
      </div>
    );
  }
}

export default LoginForm;
