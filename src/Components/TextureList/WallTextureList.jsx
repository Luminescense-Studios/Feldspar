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
      textureList: [],
      textureListSolid: [],
      textureListTile: [],
    };

    this.getUserList = this.getUserList.bind(this);
    this.getFreeList = this.getFreeList.bind(this);
    this.clearList = this.clearList.bind(this);
  }

  clearList() {
    if (this.state.isLoggedIn === false) {
      this.setState({
        textureList: [],
        textureListSolid: [],
        textureListTile: [],
      });
    }
  }

  getUserList() {
    if (this.state.isLoggedIn) {
      let textureCategory = { category: WALL_CATEGORY };
      let textureCategorySolid = { category: WALL_SOLID_CATEGORY };
      let textureCategoryTile = { category: WALL_TILE_CATEGORY };
      let token = this.props.store.getAccessToken;
      let config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      axios
        .post(BASE_URL + RESOURCES + GET_RESOURCES, textureCategory, config)
        .then((res) => {
          let textureListTemp = res.data;
          Promise.all(
            textureListTemp.map(async (textureId) => {
              let res = await axios.get(BASE_URL + TEXTURES + FIND + textureId);
              let temp = [...this.state.textureList];
              temp.push(res.data);
              this.setState({ textureList: temp });
              return res.data;
            })
          );
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
              let temp = [...this.state.textureListSolid];
              temp.push(res.data);
              this.setState({ textureListSolid: temp });
              return res.data;
            })
          );
        });

      axios
        .post(BASE_URL + RESOURCES + GET_RESOURCES, textureCategoryTile, config)
        .then((res) => {
          let textureListTemp = res.data;
          Promise.all(
            textureListTemp.map(async (textureId) => {
              let res = await axios.get(BASE_URL + TEXTURES + FIND + textureId);
              let temp = [...this.state.textureListTile];
              temp.push(res.data);
              this.setState({ textureListTile: temp });
              return res.data;
            })
          );
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
              let temp = [...this.state.textureList];
              temp.push(res.data);
              this.setState({ textureList: temp });
              return res.data;
            })
          );
        });

      axios
        .post(BASE_URL + RESOURCES + GET_FREE_RESOURCES, textureCategorySolid)
        .then((res) => {
          let textureListTemp = res.data;
          Promise.all(
            textureListTemp.map(async (textureId) => {
              let res = await axios.get(BASE_URL + TEXTURES + FIND + textureId);
              let temp = [...this.state.textureListSolid];
              temp.push(res.data);
              this.setState({ textureListSolid: temp });
              return res.data;
            })
          );
        });

      axios
        .post(BASE_URL + RESOURCES + GET_FREE_RESOURCES, textureCategoryTile)
        .then((res) => {
          let textureListTemp = res.data;
          Promise.all(
            textureListTemp.map(async (textureId) => {
              let res = await axios.get(BASE_URL + TEXTURES + FIND + textureId);
              let temp = [...this.state.textureListTile];
              temp.push(res.data);
              this.setState({ textureListTile: temp });
              return res.data;
            })
          );
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
        <div className="panel-heading">Adjust Wall</div>
        <hr className="small-underline" />
        <div className="texture-panel-heading">Patterns</div>
        <TextureList textureList={this.state.textureList.reverse()} />
        <div className="texture-panel-heading">Solids</div>
        <TextureList textureList={this.state.textureListSolid.reverse()} />
        <div className="texture-panel-heading">Tiles</div>
        <TextureList textureList={this.state.textureListTile.reverse()} />
      </div>
    );
  }
}

export default WallTextureList;
