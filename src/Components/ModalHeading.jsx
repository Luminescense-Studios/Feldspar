import "../App.css";
import React, { Component } from "react";
import { FaSignInAlt, FaSignOutAlt, FaRegSave, FaDownload } from "react-icons/fa";

export default class ModalHeading extends Component {
  render() {
    return (
      <div className="company-name">
        <span className="icon-centre">
          {this.props.icon === "signIn" && <FaSignInAlt />}
          {this.props.icon === "signOut" && <FaSignOutAlt />}
          {this.props.icon === "saveFile" && <FaRegSave />}
          {this.props.icon === "loadFile" && <FaDownload />}
        </span>
        <h2 className="login-modal-heading">{this.props.message}</h2>
      </div>
    );
  }
}
