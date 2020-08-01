import "../../App.css";
import React, { Component } from "react";
import { FaSignOutAlt } from "react-icons/fa";

export default class Company extends Component {
  render() {
    return (
      <div className="company-name">
        <span className="icon-centre">
          <FaSignOutAlt />
        </span>
        <h2 className="login-modal-heading">{this.props.message}</h2>
      </div>
    );
  }
}
