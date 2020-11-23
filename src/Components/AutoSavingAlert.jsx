import "../App.css";
import React, { Component } from "react";
import { FaSave} from "react-icons/fa"

class AutoSavingAlert extends Component {

  render() {
    return (
      <div className="auto-saving-alert-content">
        <FaSave /> Saving Locally...
      </div>
    );
  }
}

export default AutoSavingAlert;
