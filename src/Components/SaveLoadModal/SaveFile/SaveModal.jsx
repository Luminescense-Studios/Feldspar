import "../../../App.css";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import Modal from "react-bootstrap/Modal";
import ModalHeading from "../../ModalHeading.jsx";
import SaveFileList from "../SaveFileList.jsx";
import Button from "react-bootstrap/Button";
import axios from "axios";
import {
  BASE_URL,
  FLOOR_MODELS,
  REMOVE_MODEL,
  RETRIEVE_MODEL,
  UPLOAD_ASSET,
  UPDATE_ASSET_ENTRY,
  UPDATE_MODEL,
} from "../../../Constants";
import LargeAlert from "../../LargeAlert.jsx";
import $ from "jquery";

@inject("store")
@observer
class SaveModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDisabled: false,
      isError: false,
      fileName: "",
      fileNameTemp: "",
      fileUri: "",
      stateBlob: {},
      saveFileList: [],
      showModal: false,
      copied: false,
      overwrite: "Save",
    };

    this.handleClose = this.handleClose.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.updateSaveFileList = this.updateSaveFileList.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleShare = this.handleShare.bind(this);
  }

  handleClose() {
    this.props.store.setSaveFileModal(false);
    this.setState({
      fileName: "",
      fileUri: "",
      showModal: false,
      isError: false,
    });
  }

  handleShare() {
    this.setState({ copied: true, isError: false });
  }

  async handleRemove(id) {
    let token = this.props.store.getAccessToken;
    let config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    let body = { _id: id };
    try {
      await axios.post(BASE_URL + FLOOR_MODELS + REMOVE_MODEL, body, config);
      this.updateSaveFileList();
    } catch (e) {
      console.log(e);
      this.setState({ isError: true });
    }
  }

  handleClick(name, uri, event) {
    this.setState({
      fileName: name,
      fileUri: uri,
      isError: false,
      overwrite: "Overwrite",
    });
    $(".save-file-list-item").css("background-color", "#fafafa");
    event.currentTarget.style.backgroundColor = "#e6e6e6";
  }

  handleInputChange(event) {
    $(".save-file-list-item").css("background-color", "#fafafa");
    this.setState({
      fileName: event.target.value,
      fileNameTemp: event.target.value,
      isError: false,
      overwrite: "Save",
    });
  }

  async updateSaveFileList() {
    let token = this.props.store.getAccessToken;
    let config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    try {
      let res = await axios.post(
        BASE_URL + FLOOR_MODELS + RETRIEVE_MODEL,
        {},
        config
      );
      this.setState({ saveFileList: res.data, isError: false });
    } catch (e) {
      console.log(e);
      this.setState({ isError: true });
    }
  }

  async uploadFile(blob) {
    if (!this.state.isDisabled && this.state.fileName !== "") {
      const data = new FormData();
      data.append("file", blob);
      let token = this.props.store.getAccessToken;
      let config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      try {
        let resFileId = await axios.post(BASE_URL + UPLOAD_ASSET, data, config);

        let updateBody = {
          _id: resFileId.data,
          fileType: "floorModel",
          extension: "blueprint3d",
        };
        await axios.post(BASE_URL + UPDATE_ASSET_ENTRY, updateBody, config);

        let modelBody = {
          name: this.state.fileName,
          url: resFileId.data,
        };
        await axios.post(
          BASE_URL + FLOOR_MODELS + UPDATE_MODEL,
          modelBody,
          config
        );

        this.setState({ fileName: "", isDisabled: false, isError: false });
        this.updateSaveFileList();
        this.handleClose();
      } catch (e) {
        console.log(e);
        this.setState({ isDisabled: false, isError: true });
      }
    } else {
      this.setState({ isDisabled: false, isError: false });
    }
  }

  componentDidUpdate(prevProps, prevState, snapShot) {
    if (
      prevState.stateBlob !== this.props.blob &&
      this.props.blob !== null &&
      this.props.blob !== "" &&
      this.state.isDisabled === false
    ) {
      this.setState({
        stateBlob: this.props.blob,
        isDisabled: true,
        isError: false,
        overwrite: "Save",
      });
      this.uploadFile(this.props.blob);
    }

    if (this.props.store.showSaveFileModal && !prevState.showModal) {
      this.setState({ showModal: true, isError: false, overwrite: "Save" });
      this.updateSaveFileList();
    }
  }

  render() {
    const { store } = this.props;
    return (
      <Modal
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={store.showSaveFileModal}
        onHide={() => this.handleClose()}
        id="saveModal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <ModalHeading icon="saveFile" message="Save Project" />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="save-file-display-space">
            <SaveFileList
              clickFunc={this.handleClick}
              removeFunc={this.handleRemove}
              shareFunc={this.handleShare}
              fileList={this.state.saveFileList}
            />

            <div className="save-file-space">
              <div className="save-file-text">Save As: </div>
              <input
                type="text"
                name="name"
                value={this.state.fileNameTemp}
                className="save-file-input"
                onChange={this.handleInputChange}
              />
            </div>

            <Button
              variant="danger"
              className="login-submit-button"
              disabled={this.state.isDisabled}
              onClick={this.props.clickFunc}
            >
              {this.state.overwrite}
            </Button>
            {this.state.copied && (
              <LargeAlert
                variant="success"
                message="Link Copied to Clipboard"
              />
            )}
            {this.state.isError && (
              <LargeAlert variant="danger" message="Some Error Occurred" />
            )}
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}

export default SaveModal;
