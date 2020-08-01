import "../../App.css";
import React, { Component } from "react";

class NameDisplay extends Component {
  render() {
    return <div className="name-display">{this.props.username}</div>;
  }
}

export default NameDisplay;
