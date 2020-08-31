import "../../../App.css";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import {
  BASE_URL,
  FLOOR_MODELS,
  REMOVE_MODEL,
  RETRIEVE_MODEL,
} from "../../../Constants.js";
import Modal from "react-bootstrap/Modal";
import ModalHeading from "../../ModalHeading.jsx";
import SaveFileList from "../SaveFileList.jsx";
import Button from "react-bootstrap/Button";
import axios from "axios";
import LargeAlert from "../../LargeAlert.jsx";
import $ from "jquery";

@inject("store")
@observer
class LoadModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isDisabled: false,
      isError: false,
      fileName: "",
      fileUri: "",
      saveFileList: [],
      showModal: false,
      copied: false,
    };

    this.handleClose = this.handleClose.bind(this);
    this.updateSaveFileList = this.updateSaveFileList.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleShare = this.handleShare.bind(this);
  }

  handleButtonClick() {
    if (this.state.fileUri !== null && this.state.fileUri !== "") {
      this.props.clickFunc(this.state.fileUri);
      this.handleClose();
    }
  }

  handleClose() {
    this.props.store.setLoadFileModal(false);
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
    // console.log(uri);
    this.setState({ fileName: name, fileUri: uri, isError: false });
    $(".save-file-list-item").css("border-color", "#ffffff");
    event.currentTarget.style.borderColor = "#5a6268";
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

  componentDidUpdate(prevProps, prevState, snapShot) {
    if (this.props.store.showLoadFileModal && !prevState.showModal) {
      this.setState({ showModal: true, isError: false });
      this.updateSaveFileList();
    }
  }

  render() {
    const { store } = this.props;
    return (
      <Modal
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={store.showLoadFileModal}
        onHide={() => this.handleClose()}
        id="loadModal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <ModalHeading icon="loadFile" message="Load Project" />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="login-form-space">
            <SaveFileList
              clickFunc={this.handleClick}
              removeFunc={this.handleRemove}
              shareFunc={this.handleShare}
              fileList={this.state.saveFileList}
            />

            <Button
              variant="danger"
              className="login-submit-button"
              disabled={this.state.isDisabled}
              onClick={this.handleButtonClick}
            >
              Load
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

export default LoadModal;
