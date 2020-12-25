import "../../App.css";
import React, { Component } from "react";
import { BASE_URL, ASSETS, LOGO_NO_MOON } from "../../Constants";

class LogoCircle extends Component {
  render() {
    return (
      <div className="logo-circle-space">
        <div className="logo-circle-component">
          <img
            src={BASE_URL + ASSETS + LOGO_NO_MOON}
            className="logo-circle"
            alt=""
          />
        </div>
      </div>
    );
  }
}

export default LogoCircle;
