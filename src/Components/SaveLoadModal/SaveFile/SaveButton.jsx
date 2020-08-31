import "../../../App.css";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { FaRegSave } from "react-icons/fa";

@inject("store")
@observer
class SaveButton extends Component {
  constructor(props) {
    super(props);

    this.handleSaveFileShow = this.handleSaveFileShow.bind(this);
  }

  handleSaveFileShow(e) {
    e.preventDefault();
    this.props.store.setSaveFileModal(true);
  }

  render() {
    return (
      <div onClick={(e) => this.handleSaveFileShow(e)}>
        <FaRegSave />
      </div>
    );
  }
}

export default SaveButton;
