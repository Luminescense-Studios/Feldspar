import "../App.css";
import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import { FaTrashAlt, FaClone } from "react-icons/fa";
import { BASE_URL, ASSETS, MIRROR_ITEM_ICON } from "../Constants.js";
import { inject, observer } from "mobx-react";

@inject("store")
@observer
class ContextMenu extends Component {
  render() {
    // const { store } = this.props;
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
        <Button
          variant="danger"
          size="sm"
          block
          id="context-menu-mirrorize"
          className="outline-button"
        >
          <span className="icon-centre-svg">
            <img
              className="icon-svg"
              src={BASE_URL + ASSETS + MIRROR_ITEM_ICON}
              alt=""
            />
          </span>
          <span className="text-centre">Mirror</span>
        </Button>
        <Button
          variant="danger"
          size="sm"
          block
          id="context-menu-duplicate"
          className="outline-button add-item"
        >
          <span className="icon-centre-svg">
            <FaClone />
          </span>
          <span className="text-centre">Duplicate</span>
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
              <div className="form-group" id="item-height-div">
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

export default ContextMenu;