import React, { Component } from "react";
import CardList from "./CardList.js";

export default class CardListSofa extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemList: [
        {
          modelName: "Settie Sofa",
          modelUrl: "http://localhost:8001/assets/5f00c02ab799b5146c587be5",
          modelType: "1",
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
