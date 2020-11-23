import "../../App.css";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import Button from "react-bootstrap/Button";
import {
  FaSearchMinus,
  FaSearchPlus,
  FaHome,
  FaArrowUp,
  FaArrowDown,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";

@inject("store")
@observer
class CameraButtons extends Component {
  render() {
    return (
      <div id="camera-controls">
        <Button
          variant="light"
          size="sm"
          id="zoom-out"
          className={"basic-button"}
        >
          <FaSearchMinus />
        </Button>
        <Button
          variant="light"
          size="sm"
          id="reset-view"
          className={"basic-button"}
        >
          <FaHome />
        </Button>
        <Button
          variant="light"
          size="sm"
          id="zoom-in"
          className={"basic-button"}
        >
          <FaSearchPlus />
        </Button>

        <Button
          variant="light"
          size="sm"
          id="move-left"
          className={"basic-button"}
        >
          <FaArrowLeft />
        </Button>
        <div className={"vertical-controls-container"}>
          <Button
            variant="light"
            size="sm"
            id="move-up"
            className={"basic-button"}
          >
            <FaArrowUp />
          </Button>
          <Button
            variant="light"
            size="sm"
            id="move-down"
            className={"basic-button"}
          >
            <FaArrowDown />
          </Button>
        </div>
        <Button
          variant="light"
          size="sm"
          id="move-right"
          className={"basic-button"}
        >
          <FaArrowRight />
        </Button>
      </div>
    );
  }
}

export default CameraButtons;
