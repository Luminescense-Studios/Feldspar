import React, { Component } from "react";
import TextureList from "./TextureList.js";
import { BASE_URL, TEXTURES, RETRIEVE, WALL_CATEGORY, WALL_SOLID_CATEGORY, WALL_TILE_CATEGORY } from "../../Constants.js";
import axios from "axios";

export default class WallTextureList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textureList: [],
      textureListSolid: [],
      textureListTile: [],
    };
  }

  componentDidMount() {
    let textureCategory = { category: WALL_CATEGORY };
    let textureCategorySolid = { category: WALL_SOLID_CATEGORY };
    let textureCategoryTile = { category: WALL_TILE_CATEGORY };

    axios.post(BASE_URL + TEXTURES + RETRIEVE, textureCategory).then((res) => {
      this.setState({ textureList: res.data });
    });

    axios.post(BASE_URL + TEXTURES + RETRIEVE, textureCategorySolid).then((res) => {
      this.setState({ textureListSolid: res.data });
    });

    axios.post(BASE_URL + TEXTURES + RETRIEVE, textureCategoryTile).then((res) => {
      this.setState({ textureListTile: res.data });
    });
  }

  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">Adjust Wall</div>
        {/* <div className="panel-heading"></div> */}
        <TextureList textureList={this.state.textureList} />
        <div className="panel-heading">Solids</div>
        <TextureList textureList={this.state.textureListSolid} />
        <div className="panel-heading">Tiles</div>
        <TextureList textureList={this.state.textureListTile} />
      </div>
    );
  }
}
