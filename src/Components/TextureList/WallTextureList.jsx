import React, { Component } from "react";
import TextureList from "./TextureList.jsx";
import {
  BASE_URL,
  TEXTURES,
  WALL_CATEGORY,
  WALL_SOLID_CATEGORY,
  WALL_TILE_CATEGORY,
  RESOURCES,
  GET_FREE_RESOURCES,
  GET_RESOURCES,
  FIND,
} from "../../Constants.js";
import axios from "axios";
import { inject, observer } from "mobx-react";

@inject("store")
@observer
class WallTextureList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      textureListMisc: [],
      textureListSolid: [],
      textureListTile: [],
      isChecked: false,
    };

    this.getUserList = this.getUserList.bind(this);
    this.getFreeList = this.getFreeList.bind(this);
    this.clearList = this.clearList.bind(this);
    this.clearListMisc = this.clearListMisc.bind(this);
    this.clearListSolid = this.clearListSolid.bind(this);
    this.clearListTile = this.clearListTile.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    // console.log(event.target.checked)
    this.setState({ isChecked: event.target.checked });
  }

  clearList() {
    this.clearListMisc();
    this.clearListSolid();
    this.clearListTile();
  }

  clearListMisc() {
    if (this.state.isLoggedIn === false) {
      this.setState({
        textureListMisc: [],
      });
    }
  }

  clearListSolid() {
    if (this.state.isLoggedIn === false) {
      this.setState({
        textureListSolid: [],
      });
    }
  }

  clearListTile() {
    if (this.state.isLoggedIn === false) {
      this.setState({
        textureListTile: [],
      });
    }
  }

  getUserList() {
    if (this.state.isLoggedIn) {
      let textureCategory = { category: WALL_CATEGORY };
      let textureCategorySolid = { category: WALL_SOLID_CATEGORY };
      let textureCategoryTile = { category: WALL_TILE_CATEGORY };

      let config = this.props.store.getConfig;

      axios
        .post(BASE_URL + RESOURCES + GET_RESOURCES, textureCategory, config)
        .then((res) => {
          let textureListTemp = res.data;
          Promise.all(
            textureListTemp.map(async (textureId) => {
              let res = await axios.get(BASE_URL + TEXTURES + FIND + textureId);
              return res.data;
            })
          ).then((results) => {
            this.clearListMisc();
            this.setState({ textureListMisc: results });
          });
        });

      axios
        .post(
          BASE_URL + RESOURCES + GET_RESOURCES,
          textureCategorySolid,
          config
        )
        .then((res) => {
          let textureListTemp = res.data;
          Promise.all(
            textureListTemp.map(async (textureId) => {
              let res = await axios.get(BASE_URL + TEXTURES + FIND + textureId);
              return res.data;
            })
          ).then((results) => {
            this.clearListSolid();
            this.setState({ textureListSolid: results });
          });
        });

      axios
        .post(BASE_URL + RESOURCES + GET_RESOURCES, textureCategoryTile, config)
        .then((res) => {
          let textureListTemp = res.data;
          Promise.all(
            textureListTemp.map(async (textureId) => {
              let res = await axios.get(BASE_URL + TEXTURES + FIND + textureId);
              return res.data;
            })
          ).then((results) => {
            this.clearListTile();
            this.setState({ textureListTile: results });
          });
        });
    }
  }

  getFreeList() {
    if (!this.state.isLoggedIn) {
      let textureCategory = { category: WALL_CATEGORY };
      let textureCategorySolid = { category: WALL_SOLID_CATEGORY };
      let textureCategoryTile = { category: WALL_TILE_CATEGORY };

      axios
        .post(BASE_URL + RESOURCES + GET_FREE_RESOURCES, textureCategory)
        .then((res) => {
          let textureListTemp = res.data;
          Promise.all(
            textureListTemp.map(async (textureId) => {
              let res = await axios.get(BASE_URL + TEXTURES + FIND + textureId);
              return res.data;
            })
          ).then((results) => {
            this.clearListMisc();
            this.setState({ textureListMisc: results });
          });
        });

      axios
        .post(BASE_URL + RESOURCES + GET_FREE_RESOURCES, textureCategorySolid)
        .then((res) => {
          let textureListTemp = res.data;
          Promise.all(
            textureListTemp.map(async (textureId) => {
              let res = await axios.get(BASE_URL + TEXTURES + FIND + textureId);
              return res.data;
            })
          ).then((results) => {
            this.clearListSolid();
            this.setState({ textureListSolid: results });
          });
        });

      axios
        .post(BASE_URL + RESOURCES + GET_FREE_RESOURCES, textureCategoryTile)
        .then((res) => {
          let textureListTemp = res.data;
          Promise.all(
            textureListTemp.map(async (textureId) => {
              let res = await axios.get(BASE_URL + TEXTURES + FIND + textureId);
              return res.data;
            })
          ).then((results) => {
            this.clearListTile();
            this.setState({ textureListTile: results });
          });
        });
    }
  }

  componentDidMount() {
    this.getFreeList();
  }

  componentDidUpdate(prevProps, prevState, snapShot) {
    if (this.props.store.getLoggedIn && prevState.isLoggedIn === false) {
      this.setState({ isLoggedIn: true });
      this.clearList();
      this.getUserList();
    }
    if (this.props.store.getLoggedIn === false && prevState.isLoggedIn) {
      this.setState({ isLoggedIn: false });
      this.clearList();
      this.getFreeList();
    }
  }

  render() {
    return (
      <div className="texture-panel">
        <input type="checkbox" id="invisible" onChange={this.handleChange} />{" "}
        <label htmlFor="fixed">Invisible</label>
        <div id="wall-texture-panel">
          <div className="panel-heading">Adjust Wall</div>
          <hr className="small-underline" />
          <div className="texture-panel-heading">Patterns</div>
          <TextureList textureList={this.state.textureListMisc.reverse()} />
          <div className="texture-panel-heading">Solids</div>
          <TextureList textureList={this.state.textureListSolid.reverse()} />
          <div className="texture-panel-heading">Tiles</div>
          <TextureList textureList={this.state.textureListTile.reverse()} />
        </div>
      </div>
    );
  }
}

export default WallTextureList;
