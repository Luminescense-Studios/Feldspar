import React, { Component } from "react";
import CardList from "./CardList.jsx";
import {BASE_URL, MODELS, RETRIEVE, BED_CATEGORY} from "../Constants.js";
import axios from "axios";

export default class CardListArch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemList: [],
    };
  }

  componentDidMount() {
    let furnitureCategory = {category: BED_CATEGORY};

    axios.post(BASE_URL + MODELS + RETRIEVE, furnitureCategory)
      .then(res => {
        this.setState({itemList: res.data});
      })
  }


  render() {
    return (
      <div>
        <CardList itemList={this.state.itemList} />
      </div>
    );
  }
}
