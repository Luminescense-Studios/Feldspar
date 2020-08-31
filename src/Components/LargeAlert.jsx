import "../App.css";
import React, { Component } from "react";
import { Alert } from "react-bootstrap";

class LargeAlert extends Component {
  render() {
    return (
        <Alert className="large-alert" variant={this.props.variant}>{this.props.message}</Alert>
    );
  }
}

export default LargeAlert;
