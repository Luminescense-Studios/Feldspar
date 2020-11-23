import "../../../App.css";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { FaDownload } from "react-icons/fa";

@inject("store")
@observer
class LoadButton extends Component {
  constructor(props) {
    super(props);

    this.handleLoadFileShow = this.handleLoadFileShow.bind(this);
  }

  handleLoadFileShow(e) {
    e.preventDefault();
    this.props.store.setLoadFileModal(true);
  }

  render() {
    return (
      <div>
        <div
          onClick={this.handleLoadFileShow}
        >
          <FaDownload />
        </div>
      </div>
    );
  }
}

export default LoadButton;
