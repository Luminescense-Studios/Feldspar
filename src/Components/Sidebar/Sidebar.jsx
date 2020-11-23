import "../../App.css";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  FaPencilRuler,
  FaDraftingCompass,
  FaPlus,
  FaRedo,
} from "react-icons/fa";
import SaveButton from "../SaveLoadModal/SaveFile/SaveButton.jsx";
import LoadButton from "../SaveLoadModal/LoadFile/LoadButton.jsx";

@inject("store")
@observer
class Sidebar extends Component {
  render() {
    const { store } = this.props;
    return (
      <div className="sidebar">
        {/* Main Navigation */}
        <div>
          <ul className="nav nav-sidebar vertical-container">
            <li id="floorplan_tab">
              <OverlayTrigger
                placement="right"
                overlay={<Tooltip>Edit Floorplan</Tooltip>}
              >
                <div>
                  <FaPencilRuler />
                </div>
              </OverlayTrigger>
            </li>
            <li id="design_tab">
              <OverlayTrigger
                placement="right"
                overlay={<Tooltip>Design</Tooltip>}
              >
                <div>
                  <FaDraftingCompass />
                </div>
              </OverlayTrigger>
            </li>
            <li id="items_tab">
              <OverlayTrigger
                placement="right"
                overlay={<Tooltip>Add Items</Tooltip>}
              >
                <div>
                  <FaPlus />
                </div>
              </OverlayTrigger>
            </li>
          </ul>
        </div>
        <div>
          <ul className="nav nav-sidebar vertical-container">
            <li>
              <OverlayTrigger
                placement="right"
                overlay={<Tooltip>New Plan</Tooltip>}
              >
                <div id="new">
                  <FaRedo />
                </div>
              </OverlayTrigger>
            </li>
            {store.getLoggedIn && (
              <li>
                <OverlayTrigger
                  placement="right"
                  overlay={<Tooltip>Save</Tooltip>}
                >
                  <div>
                    <SaveButton />
                  </div>
                </OverlayTrigger>
              </li>
            )}
            {store.getLoggedIn && (
              <li>
                <OverlayTrigger
                  placement="right"
                  overlay={<Tooltip>Load</Tooltip>}
                >
                  <div>
                    <LoadButton />
                  </div>
                </OverlayTrigger>
              </li>
            )}
          </ul>
        </div>
      </div>
    );
  }
}

export default Sidebar;
