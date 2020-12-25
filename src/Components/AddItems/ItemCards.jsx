import React, { Component } from "react";
import CardList from "./CardList.jsx";
import {
  BASE_URL,
  MODELS,
  RESOURCES,
  GET_FREE_RESOURCES,
  GET_RESOURCES,
  FIND,
} from "../../Constants.js";
import axios from "axios";
import { inject, observer } from "mobx-react";

@inject("store")
@observer
class ItemCards extends Component {
  _isMounted = false;
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
      if (this._isMounted) {
        this.setState({
          itemList: [],
        });
      }
    }
  }

  getUserList() {
    if (this.state.isLoggedIn) {
      let furnitureCategory = { category: this.props.category };
      let config = this.props.store.getConfig;

      axios
        .post(BASE_URL + RESOURCES + GET_RESOURCES, furnitureCategory, config)
        .then((res) => {
          let itemListTemp = res.data;
          Promise.all(
            itemListTemp.map(async (modelId) => {
              let res = await axios.get(BASE_URL + MODELS + FIND + modelId);
              return res.data;
            })
          ).then((results) => {
            this.clearList();
            results.sort((a, b) => {
              if (a.groupId === undefined && b.groupId === undefined) {
                return a.name > b.name ? 1 : -1;
              }
              if (a.groupId === undefined) {
                return 1;
              }
              if (b.groupId === undefined) {
                return -1;
              }
              if (a.groupId > b.groupId) {
                return 1;
              }
              if (a.groupId === b.groupId) {
                if (a.name > b.name) {
                  return 1;
                }
              }
              return -1;
            });
            if (this._isMounted) {
              this.setState({ itemList: results });
            }
          });
        });
    }
  }

  getFreeList() {
    if (!this.state.isLoggedIn) {
      let furnitureCategory = { category: this.props.category };

      axios
        .post(BASE_URL + RESOURCES + GET_FREE_RESOURCES, furnitureCategory)
        .then((res) => {
          let itemListTemp = res.data;
          Promise.all(
            itemListTemp.map(async (modelId) => {
              let res = await axios.get(BASE_URL + MODELS + FIND + modelId);
              return res.data;
            })
          ).then((results) => {
            this.clearList();
            results.sort((a, b) => {
              if (a.groupId === undefined && b.groupId === undefined) {
                return a.name > b.name ? 1 : -1;
              }
              if (a.groupId === undefined) {
                return 1;
              }
              if (b.groupId === undefined) {
                return -1;
              }
              if (a.groupId > b.groupId) {
                return 1;
              }
              if (a.groupId === b.groupId) {
                if (a.name > b.name) {
                  return 1;
                }
              }
              return -1;
            });
            if (this._isMounted) {
              this.setState({ itemList: results });
            }
          });
        });
    }
  }

  componentDidMount() {
    this._isMounted = true;
    this.getFreeList();
  }

  componentDidUpdate(prevProps, prevState, snapShot) {
    if (this.props.store.getLoggedIn && prevState.isLoggedIn === false) {
      if (this._isMounted) {
        this.setState({ isLoggedIn: true });
      }
      this.clearList();
      this.getUserList();
    }
    if (this.props.store.getLoggedIn === false && prevState.isLoggedIn) {
      if (this._isMounted) {
        this.setState({ isLoggedIn: false });
      }
      this.clearList();
      this.getFreeList();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <div>
        <CardList itemList={this.state.itemList} />
      </div>
    );
  }
}

export default ItemCards;
