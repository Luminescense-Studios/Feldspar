import "../../App.css";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import Button from "react-bootstrap/Button";
import {
  validateEmail,
  validatePassword,
  validateUsername,
  parseJwt,
} from "../../Utils/Utils";
import axios from "axios";
import { BASE_URL_AUTH, USERS, REGISTER, LOGIN } from "../../Constants.js";

@inject("store")
@observer
class SignupForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signupUsernameValue: "",
      signupEmailValue: "",
      signupPasswordValue: "",

      signupUsernameFormatError: false,
      signupEmailFormatError: false,
      signupPasswordFormatError: false,

      isDisabled: false,

      isRegistered: false,
      isEmailExists: false,
      isError: false,
    };

    this.handleSignupUsernameChange = this.handleSignupUsernameChange.bind(
      this
    );
    this.handleSignupEmailChange = this.handleSignupEmailChange.bind(this);
    this.handleSignupPasswordChange = this.handleSignupPasswordChange.bind(
      this
    );
    this.handleSignupSubmit = this.handleSignupSubmit.bind(this);
  }

  handleSignupUsernameChange(e) {
    if (!validateUsername(e.target.value)) {
      this.setState({ signupUsernameFormatError: true });
    } else {
      this.setState({ signupUsernameFormatError: false });
    }
    this.setState({ signupUsernameValue: e.target.value });
  }

  handleSignupEmailChange(e) {
    if (!validateEmail(e.target.value)) {
      this.setState({ signupEmailFormatError: true });
    } else {
      this.setState({ signupEmailFormatError: false });
    }
    this.setState({ signupEmailValue: e.target.value });
  }

  handleSignupPasswordChange(e) {
    if (!validatePassword(e.target.value)) {
      this.setState({ signupPasswordFormatError: true });
    } else {
      this.setState({ signupPasswordFormatError: false });
    }
    this.setState({ signupPasswordValue: e.target.value });
  }

  async handleSignupSubmit(e) {
    e.preventDefault();

    if (
      !this.state.signupUsernameFormatError &&
      !this.state.signupEmailFormatError &&
      !this.state.signupPasswordFormatError &&
      this.state.signupUsernameValue !== "" &&
      this.state.signupEmailValue !== "" &&
      this.state.signupPasswordValue !== ""
    ) {
      this.setState({ isDisabled: true });
      const user = {
        name: this.state.signupUsernameValue,
        email: this.state.signupEmailValue,
        password: this.state.signupPasswordValue,
      };
      try {
        let res = await axios.post(BASE_URL_AUTH + USERS + REGISTER, user);
        this.setState({
          isError: false,
          isEmailExists: false,
          isDisabled: true,
          isRegistered: true,
        });
      } catch (e) {
        if (e.response === undefined) {
          this.setState({
            isError: true,
            isEmailExists: false,
            isDisabled: true,
          });
        } else if (e.response.status === 403) {
          this.setState({
            isError: false,
            isEmailExists: true,
            isDisabled: false,
          });
        } else {
          this.setState({
            isError: true,
            isEmailExists: false,
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
            this.handleSignupSubmit(e);
          }}
        >
          <input
            placeholder="Your Name"
            variant="secondary"
            size="sm"
            type="text"
            value={this.state.signupUsernameValue}
            onChange={(e) => {
              this.handleSignupUsernameChange(e);
            }}
            className="login-form-input"
          />
          {this.state.signupEmailFormatError && <div>invalid email</div>}
          <input
            placeholder="example@xyz.com"
            variant="secondary"
            size="sm"
            type="email"
            value={this.state.signupEmailValue}
            onChange={(e) => {
              this.handleSignupEmailChange(e);
            }}
            className="login-form-input"
          />

          {this.state.signupPasswordFormatError && <div>min. 8 characters</div>}
          <input
            placeholder="password"
            variant="secondary"
            size="sm"
            type="password"
            value={this.state.signupPasswordValue}
            onChange={(e) => {
              this.handleSignupPasswordChange(e);
            }}
            className="login-form-input"
          />

          <Button type="submit" disabled={this.state.isDisabled}>
            SignUp
          </Button>
        </form>

        {this.state.isRegistered && <div>Successfully Registered</div>}
        {this.state.isError && <div>Some ErrorOcurred</div>}
        {this.state.isEmailExists && <div>Email already registered</div>}
      </div>
    );
  }
}

export default SignupForm;
