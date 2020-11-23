import "../../../../App.css";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import axios from "axios";
import {
  BASE_URL_AUTH,
  USERS,
  LOGIN_WITH_GOOGLE,
} from "../../../../Constants.js";
import { parseJwt } from "../../../../Utils/Utils";
import SmallAlert from "../../../SmallAlert.jsx";
// import GoogleButton from "../LoginWithGoogle/GoogleButton.jsx";
import { Event } from "../../../../GATracker/index";

@inject("store")
@observer
class LoginWithFacebook extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      isError: false,
    };
    this.responseFacebook = this.responseFacebook.bind(this);
    this.handleFacebookLogin = this.handleFacebookLogin.bind(this);
  }

  responseFacebook(response) {
    console.log(response);
    // Event("LOGIN", "Login with Facebook Failed", "LOGIN_MODAL");
  }

  async handleFacebookLogin(response) {
    Event("LOGIN", "Login with Facebook", "LOGIN_MODAL");
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
        <FacebookLogin
          appId="1124300111373261"
          callback={this.responseFacebook}
          scope="public_profile"
          render={(renderProps) => (
            <button onClick={renderProps.onClick}>
              This is my custom FB button
            </button>
          )}
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

export default LoginWithFacebook;
