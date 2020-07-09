import React, { Component } from "react";
import CardList from "./CardList.js";

export default class CardListArch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemList: [
        {
          modelName: "Closed Door",
          modelUrl: "http://localhost:8001/assets/5f01863c1468b92060621a76",
          modelType: "7",
          imgUrl:
            "https://rukminim1.flixcart.com/image/416/416/jh2aqvk0/diwan-settee/g/x/8/cream-color-rosewood-sheesham-uh-dwn-0010w-aarsun-brown-original-imaf53wahgfbm6qh.jpeg?q=70",
        },
        {
          modelName: "Window",
          modelUrl: "http://localhost:8001/assets/5f0195cc1468b92060621a7f",
          modelType: "3",
          imgUrl:
            "https://rukminim1.flixcart.com/image/416/416/jh2aqvk0/diwan-settee/g/x/8/cream-color-rosewood-sheesham-uh-dwn-0010w-aarsun-brown-original-imaf53wahgfbm6qh.jpeg?q=70",
        },
      ],
    };
  }

  render() {
    return (
      <div>
        <CardList itemList={this.state.itemList} />{" "}
      </div>
    );
  }
}
