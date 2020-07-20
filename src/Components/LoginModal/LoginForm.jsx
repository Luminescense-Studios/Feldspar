import "../../App.css";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import Button from "react-bootstrap/Button";
import { validateEmail, parseJwt } from "../../Utils/Utils";
import axios from "axios";
import { BASE_URL_AUTH, USERS, LOGIN } from "../../Constants.js";

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
        console.log(res);
        this.setState({
          isError: false,
          isEmailExists: true,
          isPasswordCorrect: true,
          isDisabled: true,
        });

        const loggedInUser = parseJwt(res.data.accessToken);
        this.props.store.setLoggedIn(true);
        this.props.store.setUsername(loggedInUser.name);
        this.props.store.setAccessToken(res.data.accessToken);
        this.props.store.setRefreshToken(res.data.refreshToken);

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
          {this.state.loginEmailFormatError && <div>invalid email</div>}
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

          <Button disabled={this.state.isDisabled} type="submit">
            Login
          </Button>
        </form>

        {!this.state.isEmailExists && <div>Email is not registered</div>}
        {this.state.isError && <div>Some ErrorOcurred</div>}
        {!this.state.isPasswordCorrect && <div>Password Incorrect</div>}
      </div>
    );
  }
}

export default LoginForm;
