import "../../../../App.css";
import React, { Component } from "react";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import Button from "react-bootstrap/Button";

class GoogleButton extends Component {
  render() {
    return (
      <Button
        onClick={this.props.onClick}
        disabled={this.props.disabled}
        variant={this.props.variant}
      >
        <div className="row login-with-google-button">
          {this.props.org === "google" && <FaGoogle />}
          {this.props.org === "facebook" && <FaFacebook />}
          <div className="text-small">{this.props.message}</div>
        </div>
      </Button>
    );
  }
}

export default GoogleButton;
