import "../App.css";
import React, { Component } from "react";
import { BASE_URL, ASSETS } from "../Constants.js";

export default class TextureList extends Component {
  render() {
    return (
      <div className="texture-tiles" style={{ color: "#333333" }}>
        {this.props.textureList.map((texture, iterator) => (
          <div
            key={iterator}
            className="texture-select-thumbnail"
            texture-url={BASE_URL + ASSETS + texture.url}
            texture-stretch={texture.stretch.toString()}
            texture-scale={texture.scale}
          >
            <img
              className="thumbnail"
              alt="Thumbnail light fine wood"
              src={BASE_URL + ASSETS + texture.thumbnailUrl}
            />
          </div>
        ))}
      </div>
    );
  }
}
