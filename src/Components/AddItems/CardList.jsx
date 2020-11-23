import "../../App.css";
import React, { Component } from "react";
import { Card } from "react-bootstrap";
import {
  BASE_URL,
  ASSETS,
  IMAGE_FURNITURE_PLACEHOLDER,
} from "../../Constants.js";
import { inject, observer } from "mobx-react";
import $ from "jquery";

@inject("store")
@observer
class CardList extends Component {
  componentDidMount() {
    $("#add-items")
      .find(".add-item")
      .hover(function (e) {
        $(".item-card-title").removeClass("active-title");
        $(this).find(".item-card-title").addClass("active-title");
      });
  }

  componentDidUpdate(prevProps, prevState, snapShot) {
    if (this.props.itemList !== prevProps.itemList) {
      this.props.store.setClickListener(true);
    }
  }
  render() {
    return (
      <div>
        {this.props.itemList.map((item, iterator) => (
          <Card
            modelurl={BASE_URL + ASSETS + item.url}
            modeltype={item.type}
            modelname={item.name}
            onClick={(event) => {
              this.props.store.setClickListener(true);
            }}
            key={iterator}
            className="bg-dark text-white item-card add-item"
          >
            <Card.Img
              src={
                BASE_URL +
                ASSETS +
                (item.imgUrl === "" ? IMAGE_FURNITURE_PLACEHOLDER : item.imgUrl)
              }
              className="item-card-img"
            />
            <Card.ImgOverlay className="item-card-body">
              <Card.Body className="item-card-title-outer">
                <div className="item-card-title">{item.name}</div>
              </Card.Body>
            </Card.ImgOverlay>
          </Card>
        ))}
      </div>
    );
  }
}

export default CardList;
