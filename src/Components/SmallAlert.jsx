import "../App.css";
import React, { Component } from "react";
import { Alert } from "react-bootstrap";

class SmallAlert extends Component {
  render() {
    return (
        <Alert className="small-alert" variant={this.props.variant}>{this.props.message}</Alert>
    );
  }
}

export default SmallAlert;
