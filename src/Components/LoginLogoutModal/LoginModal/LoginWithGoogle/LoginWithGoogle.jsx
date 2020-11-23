import "../../../../App.css";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import GoogleLogin from "react-google-login";
import axios from "axios";
import {
  BASE_URL_AUTH,
  USERS,
  LOGIN_WITH_GOOGLE,
} from "../../../../Constants.js";
import { parseJwt } from "../../../../Utils/Utils";
import SmallAlert from "../../../SmallAlert.jsx";
import GoogleButton from "./GoogleButton.jsx";
import { Event } from "../../../../GATracker/index";

@inject("store")
@observer
class LoginWithGoogle extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      isError: false,
    };
    this.responseGoogle = this.responseGoogle.bind(this);
    this.handleGoogleLogin = this.handleGoogleLogin.bind(this);
  }

  responseGoogle(response) {
    console.log(response);
    Event("LOGIN", "Login with Google Failed", "LOGIN_MODAL");
  }

  async handleGoogleLogin(response) {
    Event("LOGIN", "Login with Google", "LOGIN_MODAL");
    try {
      let user = {
        accessToken: response.accessToken,
        name: response.profileObj.givenName,
      };
      let res = await axios.post(
        BASE_URL_AUTH + USERS + LOGIN_WITH_GOOGLE,
        user
      );
      if (this._isMounted) {
        this.setState({
          isError: false,
        });
      }

      const loggedInUser = parseJwt(res.data.accessToken);

      this.props.store.setUsername(loggedInUser.name);
      this.props.store.setAccessToken(res.data.accessToken);
      this.props.store.setRefreshToken(res.data.refreshToken);
      this.props.store.setLoggedIn(true);
      this.props.store.setLoggedInWithApp("Google");

      this.props.store.setLoginModal(false);
    } catch (e) {
      if (e.response === undefined) {
        console.log(e);
      } else if (e.response.status !== 200) {
        if (this._isMounted) {
          this.setState({
            isError: true,
          });
        }
      }
    }
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <div className="login-with-google-container">
        <GoogleLogin
          clientId="873610085760-45ha60uesqb5kjfd4q6dk5h34ulquop1.apps.googleusercontent.com"
          render={(renderProps) => (
            <GoogleButton
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
              variant="outline-danger"
              message="Sign-in with Google"
              org="google"
            />
          )}
          onSuccess={this.handleGoogleLogin}
          onFailure={this.responseGoogle}
          cookiePolicy={"single_host_origin"}
          isSignedIn={true}
        />
        {this.state.isError && (
          <div>
            <SmallAlert message="Some Error Occurred" variant="danger" />
          </div>
        )}
      </div>
    );
  }
}

export default LoginWithGoogle;
