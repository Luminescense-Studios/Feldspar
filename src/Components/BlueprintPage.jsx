import "../App.css";
import React, { Component } from "react";
import $ from "jquery";
import axios from "axios";
import { BP3D } from "../engine/blueprint3d.js";
import { INIT_STRUCTURE, NEW_STRUCTURE } from "../Structures.js";
import { BASE_URL, ASSETS } from "../Constants.js";
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
  FaPencilRuler,
  FaDraftingCompass,
  FaPlus,
  FaRedo,
} from "react-icons/fa";
import { Tabs, Tab, OverlayTrigger, Tooltip } from "react-bootstrap";
import CardListSofa from "./AddItems/CardListSofa.jsx";
import CardListChair from "./AddItems/CardListChair.jsx";
import CardListBed from "./AddItems/CardListBed.jsx";
import CardListRug from "./AddItems/CardListRug.jsx";
import CardListMisc from "./AddItems/CardListMisc.jsx";
import CardListKitchen from "./AddItems/CardListKitchen.jsx";
import CardListArch from "./AddItems/CardListArch.jsx";
import CardListBath from "./AddItems/CardListBath.jsx";
import CardListLight from "./AddItems/CardListLight.jsx";
import FloorTextureList from "./TextureList/FloorTextureList.jsx";
import WallTextureList from "./TextureList/WallTextureList.jsx";
import ContextMenu from "./ContextMenu.jsx";
import SaveButton from "./SaveLoadModal/SaveFile/SaveButton.jsx";
import LoadButton from "./SaveLoadModal/LoadFile/LoadButton.jsx";
import SaveModal from "./SaveLoadModal/SaveFile/SaveModal.jsx";
import LoadModal from "./SaveLoadModal/LoadFile/LoadModal.jsx";

import { inject, observer } from "mobx-react";

@inject("store")
@observer
class BlueprintPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key: "sofa",
      blueprint3d: {},
      addClickListener: false,
      currentStateName: "Design",
      blob: "",
    };
    this.engine = this.engine.bind(this);
    this.setDesignState = this.setDesignState.bind(this);
    this.cameraButtons = this.cameraButtons.bind(this);
    this.contextMenu = this.contextMenu.bind(this);
    this.modalEffects = this.modalEffects.bind(this);
    this.sideMenu = this.sideMenu.bind(this);
    this.textureSelector = this.textureSelector.bind(this);
    this.initItems = this.initItems.bind(this);
    this.saveFile = this.saveFile.bind(this);
    this.loadFile = this.loadFile.bind(this);
  }

  saveFile() {
    if (this.state.blueprint3d.model !== undefined) {
      var data = this.state.blueprint3d.model.exportSerialized();
      // var a = window.document.createElement("a");
      var blob = new Blob([data], {
        type: "text",
      });
      this.setState({ blob: blob });
      // a.href = window.URL.createObjectURL(blob);
      // a.download = "design.blueprint3d";
      // document.body.appendChild(a);
      // a.click();
      // document.body.removeChild(a);
    }
  }

  async loadFile(uri) {
    try {
      // console.log("uri: " + uri);
      if (uri !== null && uri !== "") {
        let res = await axios.get(BASE_URL + ASSETS + uri);
        this.state.blueprint3d.model.loadSerialized(JSON.stringify(res.data));
      } else {
        console.log("uri is null");
      }
    } catch (e) {
      console.log(e);
    }
  }

  /*
   * Camera Buttons
   */
  cameraButtons(blueprint3d) {
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
      $("#zoom-in").on("touchend", zoomIn);
      $("#zoom-out").click(zoomOut);
      $("#zoom-out").on("touchend", zoomOut);

      $("#zoom-in").dblclick(preventDefault);
      $("#zoom-out").dblclick(preventDefault);

      $("#reset-view").click(three.centerCamera);
      $("#reset-view").on("touchend", three.centerCamera);

      $("#move-left").click(function () {
        pan(directions.LEFT);
      });
      $("#move-left").on("touchend", function () {
        pan(directions.LEFT);
      });

      $("#move-right").click(function () {
        pan(directions.RIGHT);
      });
      $("#move-right").on("touchend", function () {
        pan(directions.RIGHT);
      });

      $("#move-up").click(function () {
        pan(directions.UP);
      });
      $("#move-up").on("touchend", function () {
        pan(directions.UP);
      });

      $("#move-down").click(function () {
        pan(directions.DOWN);
      });
      $("#move-down").on("touchend", function () {
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
    this.setState({ blueprint3d: blueprint3d });
  }

  /*
   * Context menu for selected item
   */
  contextMenu(blueprint3d) {
    // var scope = this;
    var selectedItem;
    var three = blueprint3d.three;

    function init() {
      $("#context-menu-delete").click(function (event) {
        selectedItem.remove();
      });
      $("#context-menu-delete").on("touchend", function (event) {
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
      $("#item-elevation").val(cmToIn(selectedItem.getElevation()).toFixed(0));

      $("texture-context-container").show();
      $("#context-menu").show();

      if (selectedItem.isElevationAdjustable()) {
        $("#item-elevation-div").show();
      } else {
        $("#item-elevation-div").hide();
      }

      $("#fixed").prop("checked", item.fixed);
    }

    function resize() {
      selectedItem.resize(
        inToCm($("#item-height").val()),
        inToCm($("#item-width").val()),
        inToCm($("#item-depth").val())
      );
    }

    function elevate() {
      selectedItem.elevate(inToCm($("#item-elevation").val()));
    }

    function initResize() {
      $("#item-height").change(resize);
      $("#item-width").change(resize);
      $("#item-depth").change(resize);
      $("#item-elevation").change(elevate);
    }

    function itemUnselected() {
      selectedItem = null;
      $("texture-context-container").hide();
      $("#context-menu").hide();
    }

    init();
    this.setState({ blueprint3d: blueprint3d });
  }

  /*
   * Loading modal for items
   */
  modalEffects(blueprint3d) {
    // var scope = this;
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
    this.setState({ blueprint3d: blueprint3d });
  }

  /*
   * Side menu
   */
  sideMenu = function (blueprint3d, floorplanControls, modalEffects) {
    // var modalEffects = modalEffectsArg;

    var ACTIVE_CLASS = "active";

    var tabs = {
      FLOORPLAN: $("#floorplan_tab"),
      SHOP: $("#items_tab"),
      DESIGN: $("#design_tab"),
    };

    // var scope = this;
    var stateChangeCallbacks = $.Callbacks();

    var states = {
      DEFAULT: {
        div: $("#viewer"),
        tab: tabs.DESIGN,
        name: "Design",
      },
      FLOORPLAN: {
        div: $("#floorplanner"),
        tab: tabs.FLOORPLAN,
        name: "Floorplan",
      },
      SHOP: {
        div: $("#add-items"),
        tab: tabs.SHOP,
        name: "Shop",
      },
    };

    // sidebar state
    var currentState = states.FLOORPLAN;

    function init() {
      for (var tab in tabs) {
        var elem = tabs[tab];
        elem.click(tabClicked(elem));
      }

      $("#update-floorplan").click(floorplanUpdate);
      function reset() {
        $("texture-context-container").hide();
        $("#wallTextures").hide();
        $("#floorTexturesDiv").hide();
      }
      stateChangeCallbacks.add(reset);

      initLeftMenu();

      blueprint3d.three.updateWindowSize();
      handleWindowResize();

      initItems();

      setCurrentState(states.DEFAULT, true);
    }

    function floorplanUpdate() {
      setCurrentState(states.DEFAULT);
    }

    function tabClicked(tab) {
      return function () {
        // Stop three from spinning
        initItems();
        blueprint3d.three.stopSpin();

        // Selected a new tab
        for (var key in states) {
          var state = states[key];
          if (state.tab === tab) {
            setCurrentState(state);
            break;
          }
        }
      };
    }

    var getCurrentState = () => {
      if (this.state.currentStateName === "Design") {
        return states.DEFAULT;
      }
      if (this.state.currentStateName === "Floorplan") {
        return states.FLOORPLAN;
      }
      if (this.state.currentStateName === "Shop") {
        return states.SHOP;
      }
      return null;
    };

    var updateState = (newState) => {
      this.setState({ currentStateName: newState.name });
    };

    function setCurrentState(newState, firstTime) {
      currentState = getCurrentState();
      firstTime = firstTime || false;
      if (!firstTime && currentState.name === newState.name) {
        return;
      }

      // show the right tab as active
      if (currentState.name !== newState.name) {
        if (currentState.tab != null) {
          currentState.tab.removeClass(ACTIVE_CLASS);
        }
        if (newState.tab != null) {
          newState.tab.addClass(ACTIVE_CLASS);
        }
      }

      if (currentState.name === newState.name) {
        newState.tab.addClass(ACTIVE_CLASS);
      }

      // set item unselected
      if (firstTime || newState.name !== "Design") {
        blueprint3d.three.getController().setSelectedObject(null);
      }

      // show and hide the right divs
      currentState.div.hide();
      newState.div.show();

      // custom actions
      if (newState === states.FLOORPLAN) {
        floorplanControls.handleWindowResize();
        floorplanControls.updateFloorplanView();
      }

      if (currentState === states.FLOORPLAN) {
        blueprint3d.model.floorplan.update();
      }

      if (newState === states.DEFAULT) {
        blueprint3d.three.updateWindowSize();
      }

      // set new state
      handleWindowResize();
      currentState = newState;
      updateState(newState);

      stateChangeCallbacks.fire(newState);

      //change mobx state-active-tab
    }

    function initLeftMenu() {
      $(window).resize(handleWindowResize);
      handleWindowResize();
    }

    function handleWindowResize() {
      // $(".sidebar").height(window.innerHeight);
      // $("#add-items").height(window.innerHeight);
    }

    var initItems = () => {
      this.initItems(blueprint3d, setCurrentState);
    };

    init();
    this.setState({ blueprint3d: blueprint3d });
  };

  initItems(blueprint3d, setCurrentState) {
    $("#add-items").find(".add-item").off("click");
    $("#add-items")
      .find(".add-item")
      .click(function (e) {
        var modelUrl = $(this).attr("model-url");
        var itemType = parseInt($(this).attr("model-type"));
        var metadata = {
          itemName: $(this).attr("model-name"),
          resizable: true,
          modelUrl: modelUrl,
          itemType: itemType,
        };

        blueprint3d.model.scene.addItem(itemType, modelUrl, metadata);
        setCurrentState(
          {
            div: $("#viewer"),
            tab: $("#design_tab"),
            name: "Design",
          },
          false
        );
      });
  }

  /*
   * Change floor and wall textures
   */
  textureSelector(blueprint3d, sideMenu) {
    // var scope = this;
    var three = blueprint3d.three;
    // var isAdmin = isAdmin;

    var currentTarget = null;

    function initTextureSelectors() {
      $(".texture-select-thumbnail").off("click");
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
      three.wallClicked.add(initTextureSelectors);
      three.floorClicked.add(floorClicked);
      three.wallClicked.add(initTextureSelectors);
      three.itemSelectedCallbacks.add(reset);
      three.wallClicked.add(initTextureSelectors);
      three.nothingClicked.add(reset);
      three.wallClicked.add(initTextureSelectors);
      // sideMenu.stateChangeCallbacks.add(reset);
      three.wallClicked.add(initTextureSelectors);
      initTextureSelectors();
    }

    function wallClicked(halfEdge) {
      if (currentTarget !== undefined && currentTarget !== null) {
        currentTarget.removeOutline();
      }
      currentTarget = halfEdge;
      currentTarget.drawOutline();
      $("#floorTexturesDiv").hide();
      $("texture-context-container").show();
      $("#wallTextures").show();
      initTextureSelectors();
    }

    function floorClicked(room) {
      if (currentTarget !== undefined && currentTarget !== null) {
        currentTarget.removeOutline();
      }
      currentTarget = room;
      currentTarget.drawOutline();
      $("#wallTextures").hide();
      $("texture-context-container").show();
      $("#floorTexturesDiv").show();
      initTextureSelectors();
    }

    function reset() {
      if (currentTarget !== undefined && currentTarget !== null) {
        currentTarget.removeOutline();
      }
      $("texture-context-container").hide();
      $("#wallTextures").hide();
      $("#floorTexturesDiv").hide();
      initTextureSelectors();
    }

    init();
  }

  async engine(viewKey) {
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
        // $(move).on("touchend", function () {
        //   scope.floorplanner.setMode(BP3D.Floorplanner.floorplannerModes.MOVE);
        // });

        $(draw).click(function () {
          scope.floorplanner.setMode(BP3D.Floorplanner.floorplannerModes.DRAW);
        });
        // $(draw).on("touchend", function () {
        //   scope.floorplanner.setMode(BP3D.Floorplanner.floorplannerModes.DRAW);
        // });

        $(remove).click(function () {
          scope.floorplanner.setMode(
            BP3D.Floorplanner.floorplannerModes.DELETE
          );
        });
        // $(remove).on("touchend", function () {
        //   scope.floorplanner.setMode(
        //     BP3D.Floorplanner.floorplannerModes.DELETE
        //   );
        // });
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

    var mainControls = function (blueprint3d) {
      function newDesign() {
        blueprint3d.model.loadSerialized(NEW_STRUCTURE);
      }

      // var loadDesign = async (event) => {
      //   let name = $("#loadFile").attr('name');
      //   let file1 = await axios.get(
      //     "http://localhost:8001/assets/" + name
      //   );
      //   // var file1 = event.target.files[0];
      //   var reader = new FileReader();
      //   reader.onload = function () {
      //     var data = reader.result;
      //     blueprint3d.model.loadSerialized(data);
      //   };
      //   reader.readAsText(file1);
      //   $("#loadFile").replaceWith($("#loadFile").val("").clone(true));

      //   try {
      //     let uri = $("#loadFile").attr("uri");
      //     console.log("uri: " + uri);
      //     if (uri !== "") {
      //       let res = await axios.get("http://localhost:8001/assets/" + uri);
      //       blueprint3d.model.loadSerialized(JSON.stringify(res.data));
      //     }
      //   } catch (e) {
      //     console.log(e);
      //   }
      // };

      // function saveDesign() {
      //   var data = blueprint3d.model.exportSerialized();
      //   var a = window.document.createElement("a");
      //   var blob = new Blob([data], {
      //     type: "text",
      //   });
      //   // setBlob(blob);
      //   a.href = window.URL.createObjectURL(blob);
      //   a.download = "design";
      //   document.body.appendChild(a);
      //   a.click();
      //   document.body.removeChild(a);
      // }

      // function setBlob(blob) {
      //   setNewBlob(blob);
      // }

      function init() {
        $("#new").click(newDesign);
        // $("#new").on("touchend", newDesign);

        // $("#loadFile").click(loadDesign);
        // $("#loadFileLabel").on("touchend", function () {
        //   $("#loadFile").trigger("click");
        // });

        // $("#saveFile").click(saveDesign);
        // $("#saveFile").on("touchend", saveDesign);
      }

      init();
    };

    /*
     * Initialize!
     */

    var modalEffects = this.modalEffects(this.state.blueprint3d);
    var viewerFloorplanner = new ViewerFloorplanner(this.state.blueprint3d);
    // eslint-disable-next-line no-unused-vars
    var contextMenu = this.contextMenu(this.state.blueprint3d);
    var sideMenu = this.sideMenu(
      this.state.blueprint3d,
      viewerFloorplanner,
      modalEffects
    );

    // eslint-disable-next-line no-unused-vars
    var textureSelector = this.textureSelector(
      this.state.blueprint3d,
      sideMenu
    );
    // eslint-disable-next-line no-unused-vars
    var cameraButtons = this.cameraButtons(this.state.blueprint3d);
    mainControls(this.state.blueprint3d);

    // This serialization format needs work
    // Load a simple rectangle room
    if (viewKey === "") {
      this.state.blueprint3d.model.loadSerialized(INIT_STRUCTURE);
    } else {
      try {
        let res = await axios.get(BASE_URL + ASSETS + viewKey);
        // let file1 = new Blob(res)
        // var blueprint3d = this.state.blueprint3d;
        // var reader = new FileReader();
        //   reader.onload = function () {
        //     var data = reader.result;
        //     blueprint3d.model.loadSerialized(data);
        //   };
        //   reader.readAsText(file1);
        this.state.blueprint3d.model.loadSerialized(JSON.stringify(res.data));
      } catch (e) {
        console.log(e);
        this.state.blueprint3d.model.loadSerialized(INIT_STRUCTURE);
      }
    }
  }

  componentDidMount() {
    // const { store } = this.props;
    var opts = {
      floorplannerElement: "floorplanner-canvas",
      threeElement: "#viewer",
      threeCanvasElement: "three-canvas",
      textureDir: "rooms/textures/",
      widget: false,
    };
    this.setState({ blueprint3d: new BP3D.Blueprint3d(opts) }, () => {
      if (
        this.props.viewKey !== undefined &&
        this.props.viewKey !== null &&
        this.props.viewKey !== ""
      ) {
        this.engine(this.props.viewKey);
      } else {
        this.engine("");
      }
    });
  }

  setDesignState(newState, firstTime) {
    firstTime = firstTime || false;
    var ACTIVE_CLASS = "active";

    $("#items_tab").removeClass(ACTIVE_CLASS);
    $("#design_tab").addClass(ACTIVE_CLASS);

    // show and hide the right divs
    $("#add-items").hide();
    $("#viewer").show();

    this.state.blueprint3d.three.updateWindowSize();

    // set new state
    function handleWindowResize() {
      // $(".sidebar").height(window.innerHeight);
      // $("#add-items").height(window.innerHeight);
    }
    handleWindowResize();

    function reset() {
      $("texture-context-container").hide();
      $("#wallTextures").hide();
      $("#floorTexturesDiv").hide();
    }

    reset();
    this.setState({ currentStateName: "Design" });

    //change mobx state-active-tab
  }

  componentDidUpdate(prevProps, prevState, snapShot) {
    if (this.props.addClickListener) {
      // this.setState({ addClickListener: true });
      this.props.store.setClickListener(false);
      this.initItems(this.state.blueprint3d, this.setDesignState);
    }
    if (this.props.addClickListener === false && prevProps.addClickListener) {
      this.setState({ addClickListener: false });
    }
  }

  render() {
    const { store } = this.props;
    return (
      <div className="horizontal-container">
        {/* Left Column */}
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
          <SaveModal blob={this.state.blob} clickFunc={this.saveFile} />
          <LoadModal clickFunc={this.loadFile} />
        </div>

        <div id="texture-context-container">
          {/* Context Menu */}
          <div id="context-menu">
            <ContextMenu />
          </div>
          {/* Floor Textures */}
          <div id="floorTexturesDiv" style={{ display: "none" }}>
            <FloorTextureList loggedIn={store.getLoggedIn} />
          </div>

          {/* Wall Textures */}
          <div id="wallTextures" style={{ display: "none" }}>
            <WallTextureList loggedIn={store.getLoggedIn} />
          </div>
        </div>
        {/* End Left Column */}

        {/* Right Column */}
        <div className="right-container">
          {/* 3D Viewer */}
          <div id="viewer">
            <div id="camera-controls">
              <Button
                variant="danger"
                size="sm"
                id="zoom-out"
                className={"basic-button"}
              >
                <FaSearchMinus />
              </Button>
              <Button
                variant="danger"
                size="sm"
                id="reset-view"
                className={"basic-button"}
              >
                <FaHome />
              </Button>
              <Button
                variant="danger"
                size="sm"
                id="zoom-in"
                className={"basic-button"}
              >
                <FaSearchPlus />
              </Button>

              <Button
                variant="danger"
                size="sm"
                id="move-left"
                className={"basic-button"}
              >
                <FaArrowLeft />
              </Button>
              <div className={"vertical-controls-container"}>
                <Button
                  variant="danger"
                  size="sm"
                  id="move-up"
                  className={"basic-button"}
                >
                  <FaArrowUp />
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  id="move-down"
                  className={"basic-button"}
                >
                  <FaArrowDown />
                </Button>
              </div>
              <Button
                variant="danger"
                size="sm"
                id="move-right"
                className={"basic-button"}
              >
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
            <div id="draw-walls-hint">
              Press the "Esc" key to stop drawing walls
            </div>
          </div>
          {/* Add Items */}
          <div id="add-items">
            <Tabs
              variant="pills"
              id="controlled-tab-example"
              activeKey={this.state.key}
              onSelect={(k) => {
                this.setState({ key: k });
              }}
            >
              <Tab eventKey="sofa" title="Sofas">
                <CardListSofa loggedIn={store.getLoggedIn} />
              </Tab>
              <Tab eventKey="chair" title="Chairs">
                <CardListChair loggedIn={store.getLoggedIn} />
              </Tab>
              <Tab eventKey="bed" title="Beds">
                <CardListBed loggedIn={store.getLoggedIn} />
              </Tab>
              <Tab eventKey="rug" title="Rugs">
                <CardListRug loggedIn={store.getLoggedIn} />
              </Tab>
              <Tab eventKey="misc" title="Misc">
                <CardListMisc loggedIn={store.getLoggedIn} />
              </Tab>
              <Tab eventKey="bath" title="Bath">
                <CardListBath loggedIn={store.getLoggedIn} />
              </Tab>
              <Tab eventKey="light" title="Lights">
                <CardListLight loggedIn={store.getLoggedIn} />
              </Tab>
              <Tab eventKey="kitchen" title="Kitchen">
                <CardListKitchen loggedIn={store.getLoggedIn} />
              </Tab>
              <Tab eventKey="arch" title="Architectural">
                <CardListArch loggedIn={store.getLoggedIn} />
              </Tab>
            </Tabs>
          </div>
        </div>
        {/* End Right Column */}
      </div>
    );
  }
}

export default BlueprintPage;
