import "../App.css";
import React, { Component } from "react";
import $ from "jquery";
import axios from "axios";
import { BP3D } from "../engine/blueprint3d.js";
import { INIT_STRUCTURE, NEW_STRUCTURE } from "../Structures.js";
import { BASE_URL, ASSETS } from "../Constants.js";
import CameraButtons from "./ControlButtons/CameraButtons.jsx";
import FloorplannerButtons from "./ControlButtons/FloorplannerButtons.jsx";
import Sidebar from "./Sidebar/Sidebar.jsx";
import ItemsTab from "./AddItems/ItemsTab.jsx";
import FloorTextureList from "./TextureList/FloorTextureList.jsx";
import WallTextureList from "./TextureList/WallTextureList.jsx";
import AutoSavingAlert from "./AutoSavingAlert.jsx";
import ContextMenu from "./ContextMenu.jsx";
import SaveModal from "./SaveLoadModal/SaveFile/SaveModal.jsx";
import LoadModal from "./SaveLoadModal/LoadFile/LoadModal.jsx";
import {Event} from "../GATracker/index";
import { inject, observer } from "mobx-react";

@inject("store")
@observer
class BlueprintPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    this.saveStructureLocal = this.saveStructureLocal.bind(this);
  }

  saveFile() {
    if (this.state.blueprint3d.model !== undefined) {
      var data = this.state.blueprint3d.model.exportSerialized();
      this.saveStructureLocal();
      var blob = new Blob([data], {
        type: "text",
      });
      this.setState({ blob: blob });
    }
  }

  saveStructureLocal() {
    if (this.state.blueprint3d.model !== undefined) {
      $("#auto-saving-alert").show();
      $("#auto-saving-alert").delay(2000).fadeOut();
      var data = this.state.blueprint3d.model.exportSerialized();
      // console.log("saving to local...");
      localStorage.setItem("modelStructure", data);
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
        Event("ITEM", "ITEM REMOVED", selectedItem.metadata.itemName);
        selectedItem.remove();
      });
      $("#context-menu-delete").on("touchend", function (event) {
        Event("ITEM", "ITEM REMOVED", selectedItem.metadata.itemName);
        selectedItem.remove();
      });

      $("#context-menu-mirrorize").click(function (event) {
        Event("ITEM", "ITEM MIRRORIZED", selectedItem.metadata.itemName);
        mirrorize();
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

      $("#context-menu-duplicate").attr(
        "modelurl",
        selectedItem.metadata.modelUrl
      );
      $("#context-menu-duplicate").attr(
        "modeltype",
        selectedItem.metadata.itemType
      );
      $("#context-menu-duplicate").attr(
        "modelname",
        selectedItem.metadata.itemName
      );
      // console.log(selectedItem.metadata.itemType)

      $("#item-width").val(cmToIn(selectedItem.getWidth()).toFixed(0));
      $("#item-height").val(cmToIn(selectedItem.getHeight()).toFixed(0));
      $("#item-depth").val(cmToIn(selectedItem.getDepth()).toFixed(0));
      $("#item-elevation").val(cmToIn(selectedItem.getElevation()).toFixed(0));

      // $("texture-context-container").show();
      $("#context-menu").show();

      if (selectedItem.isElevationAdjustable()) {
        $("#item-elevation-div").show();
      } else {
        $("#item-elevation-div").hide();
      }
      if (selectedItem.isHeightAdjustable()) {
        $("#item-height-div").show();
      } else {
        $("#item-height-div").hide();
      }

      $("#fixed").prop("checked", item.fixed);
    }

    function resize() {
      if (selectedItem !== null) {
        selectedItem.resize(
          inToCm($("#item-height").val()),
          inToCm($("#item-width").val()),
          inToCm($("#item-depth").val())
        );
      }
    }

    function mirrorize() {
      if (selectedItem !== null) {
        selectedItem.mirrorize(
          inToCm($("#item-height").val()),
          inToCm($("#item-width").val()),
          inToCm($("#item-depth").val())
        );
        $("#item-width").val(cmToIn(selectedItem.getWidth()).toFixed(0));
        $("#item-height").val(cmToIn(selectedItem.getHeight()).toFixed(0));
        $("#item-depth").val(cmToIn(selectedItem.getDepth()).toFixed(0));
        $("#item-elevation").val(
          cmToIn(selectedItem.getElevation()).toFixed(0)
        );
      }
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
      // $("texture-context-container").hide();
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
        // $("texture-context-container").hide();
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
        let itemName = $(this).attr("modelname")
        Event("ITEM", "ITEM ADDED", itemName);
        var modelUrl = $(this).attr("modelurl");
        var itemType = parseInt($(this).attr("modeltype"));
        var metadata = {
          itemName: $(this).attr("modelname"),
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

    $("#context-menu").find(".add-item").off("click");
    $("#context-menu")
      .find(".add-item")
      .click(function (e) {
        let itemName = $(this).attr("modelname")
        Event("ITEM", "ITEM ADDED", itemName);
        var modelUrl = $(this).attr("modelurl");
        var itemType = parseInt($(this).attr("modeltype"));
        var metadata = {
          itemName: $(this).attr("modelname"),
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
        var textureName = $(this).attr("texture-name");
        Event("TEXTURE", "TEXTURE ADDED", textureName);
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
      // $("texture-context-container").show();
      $("#wallTextures").show();
      console.log(currentTarget.getVisible());
      if (currentTarget.getVisible()) {
        $("#wall-texture-panel").show();
      } else {
        $("#wall-texture-panel").hide();
      }
      $("#invisible").prop("checked", !currentTarget.wall.visible);
      initTextureSelectors();

      $("#invisible").click(function () {
        var checked = $(this).prop("checked");
        currentTarget.setVisible(!checked);
        if (!checked) {
          $("#wall-texture-panel").show();
        } else {
          $("#wall-texture-panel").hide();
        }
      });
    }

    function floorClicked(room) {
      if (currentTarget !== undefined && currentTarget !== null) {
        currentTarget.removeOutline();
      }
      currentTarget = room;
      currentTarget.drawOutline();
      $("#wallTextures").hide();
      // $("texture-context-container").show();
      $("#floorTexturesDiv").show();
      initTextureSelectors();
    }

    function reset() {
      if (currentTarget !== undefined && currentTarget !== null) {
        currentTarget.removeOutline();
      }
      // $("texture-context-container").hide();
      $("#wallTextures").hide();
      $("#floorTexturesDiv").hide();
      initTextureSelectors();
    }

    init();
  }

  async engine(viewKey, modelData) {
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
        // $(window).resize(scope.handleWindowResize);
        // scope.handleWindowResize2();

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
            // scope.handleWindowResize();
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
        if ($(canvasWrapper) !== undefined) {
          $(canvasWrapper).height(
            window.innerHeight - $(canvasWrapper).offset().top
          );
          scope.floorplanner.resizeView();
        }

        init();
      };

      this.handleWindowResize2 = function () {
        if ($(canvasWrapper) !== undefined) {
          $(canvasWrapper).height(
            window.innerHeight - $(canvasWrapper).offset().top
          );
          scope.floorplanner.resizeView();
        }
      };
    };

    var mainControls = function (blueprint3d) {
      function newDesign() {
        blueprint3d.model.loadSerialized(NEW_STRUCTURE);
      }

      function init() {
        $("#new").click(newDesign);
        // $("#new").on("touchend", newDesign);
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
    // console.log(modelData)
    if (viewKey === "" && modelData === null) {
      this.state.blueprint3d.model.loadSerialized(INIT_STRUCTURE);
    } else if (
      viewKey === "" &&
      modelData !== null &&
      modelData !== "" &&
      modelData !== undefined
    ) {
      // console.log(modelData)
      this.state.blueprint3d.model.loadSerialized(modelData);
    } else {
      try {
        let res = await axios.get(BASE_URL + ASSETS + viewKey);
        this.state.blueprint3d.model.loadSerialized(JSON.stringify(res.data));
      } catch (e) {
        console.log(e);
        this.state.blueprint3d.model.loadSerialized(INIT_STRUCTURE);
      }
    }
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
      // $("texture-context-container").hide();
      $("#wallTextures").hide();
      $("#floorTexturesDiv").hide();
    }

    reset();
    this.setState({ currentStateName: "Design" });

    //change mobx state-active-tab
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

    // var blueprint3d = cookie.load('blueprint3d');
    var modelData = localStorage.getItem("modelStructure");
    // console.log(modelData);
    // console.log(blueprint3d)
    if (
      this.props.viewKey !== undefined &&
      this.props.viewKey !== null &&
      this.props.viewKey !== ""
    ) {
      this.setState({ blueprint3d: new BP3D.Blueprint3d(opts) }, () => {
        this.engine(this.props.viewKey, "");
      });
    } else {
      this.setState({ blueprint3d: new BP3D.Blueprint3d(opts) }, () => {
        // if (blueprint3d !== undefined) {
        //   console.log("loaded from cookie");
        // }
        this.engine("", modelData);
        this.timerID = setInterval(() => this.saveStructureLocal(), 10000);
      });
    }
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

  componentWillUnmount() {
    clearInterval(this.timerID);
    console.log("unmounting");
  }

  render() {
    const { store } = this.props;
    return (
      <div className="horizontal-container">
        {/* Left Column */}
        <Sidebar />
        {/* End Left Column */}

        <SaveModal blob={this.state.blob} clickFunc={this.saveFile} />
        <LoadModal clickFunc={this.loadFile} />
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

        {/* Right Column */}
        <div className="right-container">
          {/* Auto-Saving Alert */}
          <div id="auto-saving-alert" style={{ display: "none" }}>
            <AutoSavingAlert />
          </div>
          {/* 3D Viewer */}
          <div id="viewer">
            <CameraButtons />

            <div id="loading-modal">
              <h1>Loading...</h1>
            </div>
          </div>

          {/*2D Floorplanner */}
          <div id="floorplanner">
            <canvas id="floorplanner-canvas"></canvas>
            <FloorplannerButtons />
            <div id="draw-walls-hint">
              Press the "Esc" key to stop drawing walls
            </div>
          </div>
          {/* Add Items */}
          <ItemsTab />
        </div>
        {/* End Right Column */}
      </div>
    );
  }
}

export default BlueprintPage;
