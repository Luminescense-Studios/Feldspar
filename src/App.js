import "./App.css";
import React, { Component } from "react";
import $ from "jquery";
import { BP3D } from "./engine/blue/blueprint3d.js";
import { initStructure } from "./Constants.js";
import Button from "react-bootstrap/Button";
import {
  FaSearchMinus,
  FaSearchPlus,
  FaHome,
  FaArrowUp,
  FaArrowDown,
  FaArrowLeft,
  FaArrowRight,
  FaChevronRight,
  FaArrowsAlt,
  FaPencilAlt,
  FaTrashAlt,
} from "react-icons/fa";

class App extends Component {
  componentDidMount() {
    /*
     * Camera Buttons
     */

    var CameraButtons = function (blueprint3d) {
      var orbitControls = blueprint3d.three.controls;
      var three = blueprint3d.three;

      var panSpeed = 30;
      var directions = {
        UP: 1,
        DOWN: 2,
        LEFT: 3,
        RIGHT: 4,
      };

      function init() {
        // Camera controls
        $("#zoom-in").click(zoomIn);
        $("#zoom-out").click(zoomOut);
        $("#zoom-in").dblclick(preventDefault);
        $("#zoom-out").dblclick(preventDefault);

        $("#reset-view").click(three.centerCamera);

        $("#move-left").click(function () {
          pan(directions.LEFT);
        });
        $("#move-right").click(function () {
          pan(directions.RIGHT);
        });
        $("#move-up").click(function () {
          pan(directions.UP);
        });
        $("#move-down").click(function () {
          pan(directions.DOWN);
        });

        $("#move-left").dblclick(preventDefault);
        $("#move-right").dblclick(preventDefault);
        $("#move-up").dblclick(preventDefault);
        $("#move-down").dblclick(preventDefault);
      }

      function preventDefault(e) {
        e.preventDefault();
        e.stopPropagation();
      }

      function pan(direction) {
        switch (direction) {
          case directions.UP:
            orbitControls.panXY(0, panSpeed);
            break;
          case directions.DOWN:
            orbitControls.panXY(0, -panSpeed);
            break;
          case directions.LEFT:
            orbitControls.panXY(panSpeed, 0);
            break;
          case directions.RIGHT:
            orbitControls.panXY(-panSpeed, 0);
            break;
          default:
            break;
        }
      }

      function zoomIn(e) {
        e.preventDefault();
        orbitControls.dollyIn(1.1);
        orbitControls.update();
      }

      function zoomOut(e) {
        // eslint-disable-next-line no-unused-expressions
        e.preventDefault;
        orbitControls.dollyOut(1.1);
        orbitControls.update();
      }

      init();
    };

    /*
     * Context menu for selected item
     */

    var ContextMenu = function (blueprint3d) {
      // var scope = this;
      var selectedItem;
      var three = blueprint3d.three;

      function init() {
        $("#context-menu-delete").click(function (event) {
          selectedItem.remove();
        });

        three.itemSelectedCallbacks.add(itemSelected);
        three.itemUnselectedCallbacks.add(itemUnselected);

        initResize();

        $("#fixed").click(function () {
          var checked = $(this).prop("checked");
          selectedItem.setFixed(checked);
        });
      }

      function cmToIn(cm) {
        return cm / 2.54;
      }

      function inToCm(inches) {
        return inches * 2.54;
      }

      function itemSelected(item) {
        selectedItem = item;

        $("#context-menu-name").text(item.metadata.itemName);

        $("#item-width").val(cmToIn(selectedItem.getWidth()).toFixed(0));
        $("#item-height").val(cmToIn(selectedItem.getHeight()).toFixed(0));
        $("#item-depth").val(cmToIn(selectedItem.getDepth()).toFixed(0));

        $("#context-menu").show();

        $("#fixed").prop("checked", item.fixed);
      }

      function resize() {
        selectedItem.resize(
          inToCm($("#item-height").val()),
          inToCm($("#item-width").val()),
          inToCm($("#item-depth").val())
        );
      }

      function initResize() {
        $("#item-height").change(resize);
        $("#item-width").change(resize);
        $("#item-depth").change(resize);
      }

      function itemUnselected() {
        selectedItem = null;
        $("#context-menu").hide();
      }

      init();
    };

    /*
     * Loading modal for items
     */

    var ModalEffects = function (blueprint3dArg) {
      // var scope = this;
      var blueprint3d = blueprint3dArg;
      var itemsLoading = 0;

      this.setActiveItem = function (active) {
        // eslint-disable-next-line no-undef
        itemSelected = active;
        update();
      };

      function update() {
        if (itemsLoading > 0) {
          $("#loading-modal").show();
        } else {
          $("#loading-modal").hide();
        }
      }

      function init() {
        blueprint3d.model.scene.itemLoadingCallbacks.add(function () {
          itemsLoading += 1;
          update();
        });

        blueprint3d.model.scene.itemLoadedCallbacks.add(function () {
          itemsLoading -= 1;
          update();
        });

        update();
      }

      init();
    };

    /*
     * Side menu
     */

    var SideMenu = function (blueprint3dArg, floorplanControlsArg, modalEffectsArg) {
      var blueprint3d = blueprint3dArg;
      var floorplanControls = floorplanControlsArg;
      // var modalEffects = modalEffectsArg;

      var ACTIVE_CLASS = "active";

      var tabs = {
        FLOORPLAN: $("#floorplan_tab"),
        SHOP: $("#items_tab"),
        DESIGN: $("#design_tab"),
      };

      var scope = this;
      this.stateChangeCallbacks = $.Callbacks();

      this.states = {
        DEFAULT: {
          div: $("#viewer"),
          tab: tabs.DESIGN,
        },
        FLOORPLAN: {
          div: $("#floorplanner"),
          tab: tabs.FLOORPLAN,
        },
        SHOP: {
          div: $("#add-items"),
          tab: tabs.SHOP,
        },
      };

      // sidebar state
      var currentState = scope.states.FLOORPLAN;

      function init() {
        for (var tab in tabs) {
          var elem = tabs[tab];
          elem.click(tabClicked(elem));
        }

        $("#update-floorplan").click(floorplanUpdate);

        initLeftMenu();

        blueprint3d.three.updateWindowSize();
        handleWindowResize();

        initItems();

        setCurrentState(scope.states.DEFAULT);
      }

      function floorplanUpdate() {
        setCurrentState(scope.states.DEFAULT);
      }

      function tabClicked(tab) {
        return function () {
          // Stop three from spinning
          blueprint3d.three.stopSpin();

          // Selected a new tab
          for (var key in scope.states) {
            var state = scope.states[key];
            if (state.tab === tab) {
              setCurrentState(state);
              break;
            }
          }
        };
      }

      function setCurrentState(newState) {
        if (currentState === newState) {
          return;
        }

        // show the right tab as active
        if (currentState.tab !== newState.tab) {
          if (currentState.tab != null) {
            currentState.tab.removeClass(ACTIVE_CLASS);
          }
          if (newState.tab != null) {
            newState.tab.addClass(ACTIVE_CLASS);
          }
        }

        // set item unselected
        blueprint3d.three.getController().setSelectedObject(null);

        // show and hide the right divs
        currentState.div.hide();
        newState.div.show();

        // custom actions
        if (newState === scope.states.FLOORPLAN) {
          floorplanControls.handleWindowResize();
          floorplanControls.updateFloorplanView();
          
        }

        if (currentState === scope.states.FLOORPLAN) {
          blueprint3d.model.floorplan.update();
        }

        if (newState === scope.states.DEFAULT) {
          blueprint3d.three.updateWindowSize();
        }

        // set new state
        handleWindowResize();
        currentState = newState;

        scope.stateChangeCallbacks.fire(newState);
      }

      function initLeftMenu() {
        $(window).resize(handleWindowResize);
        handleWindowResize();
      }

      function handleWindowResize() {
        $(".sidebar").height(window.innerHeight);
        $("#add-items").height(window.innerHeight);
      }

      // TODO: this doesn't really belong here
      function initItems() {
        $("#add-items")
          .find(".add-item")
          .mousedown(function (e) {
            var modelUrl = $(this).attr("model-url");
            var itemType = parseInt($(this).attr("model-type"));
            var metadata = {
              itemName: $(this).attr("model-name"),
              resizable: true,
              modelUrl: modelUrl,
              itemType: itemType,
            };

            blueprint3d.model.scene.addItem(itemType, modelUrl, metadata);
            setCurrentState(scope.states.DEFAULT);
          });
      }

      init();
    };

    /*
     * Change floor and wall textures
     */

    var TextureSelector = function (blueprint3d, sideMenu) {
      // var scope = this;
      var three = blueprint3d.three;
      // var isAdmin = isAdmin;

      var currentTarget = null;

      function initTextureSelectors() {
        $(".texture-select-thumbnail").click(function (e) {
          var textureUrl = $(this).attr("texture-url");
          var textureStretch = $(this).attr("texture-stretch") === "true";
          var textureScale = parseInt($(this).attr("texture-scale"));
          currentTarget.setTexture(textureUrl, textureStretch, textureScale);

          e.preventDefault();
        });
      }

      function init() {
        three.wallClicked.add(wallClicked);
        three.floorClicked.add(floorClicked);
        three.itemSelectedCallbacks.add(reset);
        three.nothingClicked.add(reset);
        sideMenu.stateChangeCallbacks.add(reset);
        initTextureSelectors();
      }

      function wallClicked(halfEdge) {
        currentTarget = halfEdge;
        $("#floorTexturesDiv").hide();
        $("#wallTextures").show();
      }

      function floorClicked(room) {
        currentTarget = room;
        $("#wallTextures").hide();
        $("#floorTexturesDiv").show();
      }

      function reset() {
        $("#wallTextures").hide();
        $("#floorTexturesDiv").hide();
      }

      init();
    };

    /*
     * Floorplanner controls
     */

    var ViewerFloorplanner = function (blueprint3d) {
      var canvasWrapper = "#floorplanner";

      // buttons
      var move = "#move";
      var remove = "#delete";
      var draw = "#draw";

      var activeStlye = "btn-primary disabled";

      this.floorplanner = blueprint3d.floorplanner;

      var scope = this;

      function init() {
        $(window).resize(scope.handleWindowResize);
        scope.handleWindowResize();

        // mode buttons
        scope.floorplanner.modeResetCallbacks.add(function (mode) {
          $(draw).removeClass(activeStlye);
          $(remove).removeClass(activeStlye);
          $(move).removeClass(activeStlye);
          if (mode === BP3D.Floorplanner.floorplannerModes.MOVE) {
            $(move).addClass(activeStlye);
          } else if (mode === BP3D.Floorplanner.floorplannerModes.DRAW) {
            $(draw).addClass(activeStlye);
          } else if (mode === BP3D.Floorplanner.floorplannerModes.DELETE) {
            $(remove).addClass(activeStlye);
          }

          if (mode === BP3D.Floorplanner.floorplannerModes.DRAW) {
            $("#draw-walls-hint").show();
            scope.handleWindowResize();
          } else {
            $("#draw-walls-hint").hide();
          }
        });

        $(move).click(function () {
          scope.floorplanner.setMode(BP3D.Floorplanner.floorplannerModes.MOVE);
        });

        $(draw).click(function () {
          scope.floorplanner.setMode(BP3D.Floorplanner.floorplannerModes.DRAW);
        });

        $(remove).click(function () {
          scope.floorplanner.setMode(
            BP3D.Floorplanner.floorplannerModes.DELETE
          );
        });
      }

      this.updateFloorplanView = function () {
        scope.floorplanner.reset();
      };

      this.handleWindowResize = function () {
        $(canvasWrapper).height(
          window.innerHeight - $(canvasWrapper).offset().top
        );
        scope.floorplanner.resizeView();
      };

      init();
    };

    var mainControls = function (blueprint3dArg) {
      var blueprint3d = blueprint3dArg;

      function newDesign() {
        blueprint3d.model.loadSerialized(initStructure);
      }

      function loadDesign() {
        // files = $("#loadFile").get(0).files;
        // var reader  = new FileReader();
        // reader.onload = function(event) {
        //     var data = event.target.result;
        //     blueprint3d.model.loadSerialized(data);
        // };
        // reader.readAsText(files[0]);
      }

      function saveDesign() {
        var data = blueprint3d.model.exportSerialized();
        var a = window.document.createElement("a");
        var blob = new Blob([data], {
          type: "text",
        });
        a.href = window.URL.createObjectURL(blob);
        a.download = "design.blueprint3d";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }

      function init() {
        $("#new").click(newDesign);
        $("#loadFile").change(loadDesign);
        $("#saveFile").click(saveDesign);
      }

      init();
    };

    /*
     * Initialize!
     */

    $(document).ready(function () {
      // main setup
      var opts = {
        floorplannerElement: "floorplanner-canvas",
        threeElement: "#viewer",
        threeCanvasElement: "three-canvas",
        textureDir: "rooms/textures/",
        widget: false,
      };
      var blueprint3d = new BP3D.Blueprint3d(opts);

      var modalEffects = new ModalEffects(blueprint3d);
      var viewerFloorplanner = new ViewerFloorplanner(blueprint3d);
      // eslint-disable-next-line no-unused-vars
      var contextMenu = new ContextMenu(blueprint3d);
      var sideMenu = new SideMenu(
        blueprint3d,
        viewerFloorplanner,
        modalEffects
      );
      // eslint-disable-next-line no-unused-vars
      var textureSelector = new TextureSelector(blueprint3d, sideMenu);
      // eslint-disable-next-line no-unused-vars
      var cameraButtons = new CameraButtons(blueprint3d);
      mainControls(blueprint3d);

      // This serialization format needs work
      // Load a simple rectangle room
      blueprint3d.model.loadSerialized(initStructure);
    });
  }
  render() {
    return (
      <div className="horizontal-container">
        {/* Left Column */}
        <div className="sidebar">
          {/* Main Navigation */}
          <ul className="nav nav-sidebar vertical-container">
            <li id="floorplan_tab">
              <div className="justify-between">
                Edit Floorplan
                <span>
                  <FaChevronRight />
                </span>
              </div>
            </li>
            <li id="design_tab">
              <div className="justify-between">
                Design
                <span>
                  <FaChevronRight />
                </span>
              </div>
            </li>
            <li id="items_tab">
              <div className="justify-between">
                Add Items
                <span>
                  <FaChevronRight />
                </span>
              </div>
            </li>
          </ul>

          <hr />

          {/* Context Menu */}
          <div id="context-menu">
            <span id="context-menu-name" className="lead"></span>
            <br />
            <br />
            <Button variant="danger" size="sm" block id="context-menu-delete">
              <span className="icon-centre">
                <FaTrashAlt />
              </span>
              <span className="text-centre">Delete Item</span>
            </Button>
            <br />

            <div className="panel panel-default">
              <div className="panel-heading">Adjust Size</div>
              <div className="panel-body" style={{ color: "#333333" }}>
                <div className="form form-horizontal">
                  <div className="form-group">
                    <label className="col-sm-5 control-label">Width</label>
                    <div className="col-sm-6">
                      <input
                        type="number"
                        className="form-control"
                        id="item-width"
                      ></input>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-sm-5 control-label">Depth</label>
                    <div className="col-sm-6">
                      <input
                        type="number"
                        className="form-control"
                        id="item-depth"
                      ></input>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-sm-5 control-label">Height</label>
                    <div className="col-sm-6">
                      <input
                        type="number"
                        className="form-control"
                        id="item-height"
                      ></input>
                    </div>
                  </div>
                </div>
                <small>
                  <span className="text-muted">Measurements in inches.</span>
                </small>
              </div>
            </div>
            <label>
              <input type="checkbox" id="fixed" /> Lock in place
            </label>
            <br />
            <br />
          </div>

          {/* Floor Textures */}
          <div
            id="floorTexturesDiv"
            style={{ display: "none", padding: "0 20px" }}
          >
            <div className="panel panel-default">
              <div className="panel-heading">Adjust Floor</div>
              <div className="texture-tiles" style={{ color: "#333333" }}>
                <div
                  className="texture-select-thumbnail"
                  texture-url="http://localhost:8001/assets/5efaf18b26d7ff32d843f48e"
                  texture-stretch="false"
                  texture-scale="300"
                >
                  <img
                    className="thumbnail"
                    alt="Thumbnail light fine wood"
                    src="http://localhost:8001/assets/5efaf25b26d7ff32d843f48f"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Wall Textures */}
          <div id="wallTextures" style={{ display: "none", padding: "0 20px" }}>
            <div className="panel panel-default">
              <div className="panel-heading">Adjust Wall</div>
              <div className="texture-tiles" style={{ color: "#333333" }}>
                <div
                  className="texture-select-thumbnail"
                  texture-url="http://localhost:8001/assets/5efaf2cf26d7ff32d843f490"
                  texture-stretch="false"
                  texture-scale="300"
                >
                  <img
                    className="thumbnail"
                    alt="Thumbnail marbletiles"
                    src="http://localhost:8001/assets/5efaf365ae554b2dd8091c5f"
                  />
                </div>

                <div
                  className="texture-select-thumbnail"
                  texture-url="http://localhost:8001/assets/5efb48a0dfc95a13c4fee860"
                  texture-stretch="true"
                  texture-scale=""
                >
                  <img
                    className="thumbnail"
                    alt="Thumbnail wallmap yellow"
                    src="http://localhost:8001/assets/5efb48eadfc95a13c4fee861"
                  />
                </div>

                <div
                  className="texture-select-thumbnail"
                  texture-url="http://localhost:8001/assets/5efb4929dfc95a13c4fee862"
                  texture-stretch="false"
                  texture-scale="100"
                >
                  <img
                    className="thumbnail"
                    alt="Thumbnail light brick"
                    src="http://localhost:8001/assets/5efb4978dfc95a13c4fee863"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* End Left Column */}

        {/* Right Column */}
        <div className="right-container">
          {/* 3D Viewer */}
          <div id="viewer">
            <div id="main-controls">
              <Button
                variant="secondary"
                size="sm"
                id="new"
                className={"basic-button"}
              >
                New Plan
              </Button>
              <Button
                variant="secondary"
                size="sm"
                id="saveFile"
                className={"basic-button"}
              >
                Save Plan
              </Button>
              <Button
                variant="secondary"
                size="sm"
                id="loadFile"
                className={"basic-button"}
              >
                Load Plan
              </Button>
            </div>

            <div id="camera-controls">
              <Button size="sm" id="zoom-out" className={"basic-button"}>
                <FaSearchMinus />
              </Button>
              <Button size="sm" id="reset-view" className={"basic-button"}>
                <FaHome />
              </Button>
              <Button size="sm" id="zoom-in" className={"basic-button"}>
                <FaSearchPlus />
              </Button>

              <Button size="sm" id="move-left" className={"basic-button"}>
                <FaArrowLeft />
              </Button>
              <div className={"vertical-controls-container"}>
                <Button size="sm" id="move-up" className={"basic-button"}>
                  <FaArrowUp />
                </Button>
                <Button size="sm" id="move-down" className={"basic-button"}>
                  <FaArrowDown />
                </Button>
              </div>
              <Button size="sm" id="move-right" className={"basic-button"}>
                <FaArrowRight />
              </Button>
            </div>

            <div id="loading-modal">
              <h1>Loading...</h1>
            </div>
          </div>

          {/*2D Floorplanner */}
          <div id="floorplanner">
            <canvas id="floorplanner-canvas"></canvas>
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
                variant="primary"
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
            <div id="draw-walls-hint">
              Press the "Esc" key to stop drawing walls
            </div>
          </div>
          {/* Add Items */}
          <div id="add-items">
            <div
              model-name="sofa"
              model-url="http://localhost:8001/assets/5f00c02ab799b5146c587be5"
              model-type="1"
              className="add-item"
            >
              <img src="https://rukminim1.flixcart.com/image/416/416/jh2aqvk0/diwan-settee/g/x/8/cream-color-rosewood-sheesham-uh-dwn-0010w-aarsun-brown-original-imaf53wahgfbm6qh.jpeg?q=70" alt="sofa" />
            </div>
            <div
              model-name="book shelf"
              model-url="http://localhost:8001/assets/5f01733ea56cad11bc1db3f4"
              model-type="2"
              className="add-item"
            >
              <img src="https://rukminim1.flixcart.com/image/416/416/jh2aqvk0/diwan-settee/g/x/8/cream-color-rosewood-sheesham-uh-dwn-0010w-aarsun-brown-original-imaf53wahgfbm6qh.jpeg?q=70" alt="sofa" />
            </div>
            <div
              model-name="door"
              model-url="http://localhost:8001/assets/5f01863c1468b92060621a76"
              model-type="7"
              className="add-item"
            >
              <img src="https://rukminim1.flixcart.com/image/416/416/jh2aqvk0/diwan-settee/g/x/8/cream-color-rosewood-sheesham-uh-dwn-0010w-aarsun-brown-original-imaf53wahgfbm6qh.jpeg?q=70" alt="sofa" />
            </div>
            
            <div
              model-name="window"
              model-url="http://localhost:8001/assets/5f0195cc1468b92060621a7f"
              model-type="3"
              className="add-item"
            >
              <img src="https://rukminim1.flixcart.com/image/416/416/jh2aqvk0/diwan-settee/g/x/8/cream-color-rosewood-sheesham-uh-dwn-0010w-aarsun-brown-original-imaf53wahgfbm6qh.jpeg?q=70" alt="sofa" />
            </div>
          </div>
        </div>
        {/* End Right Column */}
      </div>
    );
  }
}

export default App;
