import "../../App.css";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import Button from "react-bootstrap/Button";
import {
  FaChevronRight,
  FaArrowsAlt,
  FaPencilAlt,
  FaTrashAlt,
} from "react-icons/fa";

@inject("store")
@observer
class FloorplannerButtons extends Component {
  render() {
    return (
      <div id="floorplanner-controls">
        <Button
          variant="secondary"
          size="sm"
          className="icon-text-button"
          id="move"
        >
          <span className="icon-centre">
            <FaArrowsAlt />
          </span>
          <span className="text-centre">Move Walls</span>
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="icon-text-button"
          id="draw"
        >
          <span className="icon-centre">
            <FaPencilAlt />
          </span>
          <span className="text-centre">Draw Walls</span>
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="icon-text-button"
          id="delete"
        >
          <span className="icon-centre">
            <FaTrashAlt />
          </span>
          <span className="text-centre">Delete Walls</span>
        </Button>

        <Button
          variant="danger"
          size="sm"
          className="icon-text-button"
          id="update-floorplan"
        >
          <span className="text-centre">Done</span>
          <span className="icon-centre">
            <FaChevronRight />
          </span>
        </Button>
      </div>
    );
  }
}

export default FloorplannerButtons;
