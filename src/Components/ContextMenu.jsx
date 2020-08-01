import "../App.css";
import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import { FaTrashAlt } from "react-icons/fa";

export default class ContextMenu extends Component {
  render() {
    return (
      <div>
        <span id="context-menu-name" className="lead"></span>
        <Button
          variant="danger"
          size="sm"
          block
          id="context-menu-delete"
          className="outline-button"
        >
          <span className="icon-centre">
            <FaTrashAlt />
          </span>
          <span className="text-centre">Delete Item</span>
        </Button>
        <div className="panel">
          <div className="panel-heading">Adjust Size</div>
          <hr className="small-underline" />
          <div className="panel-body">
            <div className="form-horizontal">
              <div className="form-group">
                <label className="control-label">Width</label>

                <input
                  type="number"
                  className="form-control"
                  id="item-width"
                ></input>
              </div>
              <div className="form-group">
                <label className="control-label">Depth</label>

                <input
                  type="number"
                  className="form-control"
                  id="item-depth"
                ></input>
              </div>
              <div className="form-group">
                <label className="control-label">Height</label>

                <input
                  type="number"
                  className="form-control"
                  id="item-height"
                ></input>
              </div>
              <div className="form-group" id="item-elevation-div">
                <label className="control-label">Elevation</label>

                <input
                  type="number"
                  className="form-control"
                  id="item-elevation"
                ></input>
              </div>
            </div>
            <small>
              <span>Measurements in inches.</span>
            </small>
          </div>
        </div>
        <input type="checkbox" id="fixed" />{" "}
        <label htmlFor="fixed">Lock in place</label>
      </div>
    );
  }
}
