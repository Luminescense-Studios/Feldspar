import "../../App.css";
import React, { Component } from "react";

export default class Company extends Component {
  render() {
    return (
      <div className="company-name">
        <h2>{this.props.message}</h2>
      </div>
    );
  }
}
