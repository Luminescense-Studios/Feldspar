import React, { Component } from "react";
import CardList from "./CardList.js";

export default class CardListMisc extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemList: [
        {
          modelName: "Book Shelf",
          modelUrl: "http://localhost:8001/assets/5f01733ea56cad11bc1db3f4",
          modelType: "2",
          imgUrl:
            "https://rukminim1.flixcart.com/image/416/416/jh2aqvk0/diwan-settee/g/x/8/cream-color-rosewood-sheesham-uh-dwn-0010w-aarsun-brown-original-imaf53wahgfbm6qh.jpeg?q=70",
        },
      ],
    };
  }

  render() {
    return (
      <div>
        <CardList itemList={this.state.itemList} />
      </div>
    );
  }
}
