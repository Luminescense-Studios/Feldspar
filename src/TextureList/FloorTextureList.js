import React, { Component } from "react";
import TextureList from "./TextureList.js";
import {
  BASE_URL,
  TEXTURES,
  RETRIEVE,
  FLOOR_CATEGORY,
  FLOOR_WOOD_CATEGORY,
  FLOOR_MARBLE_CATEGORY,
  FLOOR_TILE_CATEGORY,
} from "../Constants.js";
import axios from "axios";

export default class FloorTextureList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textureListWood: [],
      textureListMarble: [],
      textureListTile: [],
    };
  }

  componentDidMount() {
    let textureCategoryFloorWood = { category: FLOOR_WOOD_CATEGORY };
    let textureCategoryFloorMarble = { category: FLOOR_MARBLE_CATEGORY };
    let textureCategoryFloorTile = { category: FLOOR_TILE_CATEGORY };

    axios
      .post(BASE_URL + TEXTURES + RETRIEVE, textureCategoryFloorWood)
      .then((res) => {
        this.setState({ textureListWood: res.data });
      });

    axios
      .post(BASE_URL + TEXTURES + RETRIEVE, textureCategoryFloorMarble)
      .then((res) => {
        this.setState({ textureListMarble: res.data });
      });

    axios
      .post(BASE_URL + TEXTURES + RETRIEVE, textureCategoryFloorTile)
      .then((res) => {
        this.setState({ textureListTile: res.data });
      });
  }

  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">Adjust Floor</div>
        <div className="panel-heading">Woods</div>
        <TextureList textureList={this.state.textureListWood} />
        <div className="panel-heading">Marbles</div>
        <TextureList textureList={this.state.textureListMarble} />
        <div className="panel-heading">Tiles</div>
        <TextureList textureList={this.state.textureListTile} />
      </div>
    );
  }
}
