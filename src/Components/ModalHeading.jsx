import "../App.css";
import React, { Component } from "react";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";

export default class ModalHeading extends Component {
  render() {
    return (
      <div className="company-name">
        <span className="icon-centre">
          {this.props.icon === "signIn" && <FaSignInAlt />}
          {this.props.icon === "signOut" && <FaSignOutAlt />}
          {this.props.icon === "saveFile" && <FaSignOutAlt />}
          {this.props.icon === "loadFile" && <FaSignOutAlt />}
        </span>
        <h2 className="login-modal-heading">{this.props.message}</h2>
      </div>
    );
  }
}
