import React, { Component } from "react";
import CardList from "./CardList.jsx";
import {
  BASE_URL,
  MODELS,
  RESOURCES,
  GET_FREE_RESOURCES,
  GET_RESOURCES,
  FIND,
  BATH_CATEGORY,
} from "../../Constants.js";
import axios from "axios";
import { inject, observer } from "mobx-react";

@inject("store")
@observer
class CardListBath extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      itemList: [],
    };
    this.getUserList = this.getUserList.bind(this);
    this.getFreeList = this.getFreeList.bind(this);
    this.clearList = this.clearList.bind(this);
  }

  clearList() {
    if (this.state.isLoggedIn === false) {
      this.setState({
        itemList: [],
      });
    }
  }

  getUserList() {
    if (this.state.isLoggedIn) {
      let bathCategory = { category: BATH_CATEGORY };

      let token = this.props.store.getAccessToken;
      let config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      axios
        .post(BASE_URL + RESOURCES + GET_RESOURCES, bathCategory, config)
        .then((res) => {
          let itemListTemp = res.data;
          Promise.all(
            itemListTemp.map(async (modelId) => {
              let res = await axios.get(BASE_URL + MODELS + FIND + modelId);
              let temp = [...this.state.itemList];
              temp.push(res.data);
              this.setState({ itemList: temp });
              return res.data;
            })
          );
        });
    }
  }

  getFreeList() {
    if (!this.state.isLoggedIn) {
      let bathCategory = { category: BATH_CATEGORY };

      axios
        .post(BASE_URL + RESOURCES + GET_FREE_RESOURCES, bathCategory)
        .then((res) => {
          let itemListTemp = res.data;
          Promise.all(
            itemListTemp.map(async (modelId) => {
              let res = await axios.get(BASE_URL + MODELS + FIND + modelId);
              let temp = [...this.state.itemList];
              temp.push(res.data);
              this.setState({ itemList: temp });
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
      <div>
        <CardList itemList={this.state.itemList} />
      </div>
    );
  }
}

export default CardListBath;
