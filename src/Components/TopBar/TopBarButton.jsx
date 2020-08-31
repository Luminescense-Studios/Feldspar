import "../../App.css";
import React, { Component } from "react";
import Button from "react-bootstrap/Button";

export default class TopBar extends Component {
  handleClick = (e) => {
    this.props.clickFunc(e);
  };
  render() {
    return (
      <div className="vertical-centre">
        <Button
          variant="outline-dark"
          className="top-bar-login-button"
          onClick={(e) => this.handleClick(e)}
        >
          {this.props.message}.
        </Button>
        <hr className="small-underline-right" />
      </div>
    );
  }
}
