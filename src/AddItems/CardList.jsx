import "../App.css";
import React, { Component } from "react";
import { Card, Button } from "react-bootstrap";
import { BASE_URL, ASSETS } from "../Constants.js";

export default class CardList extends Component {
  render() {
    return (
      <div>
        {this.props.itemList.map((item, iterator) => (
          <Card key={iterator} className="item-card">
            <Card.Img
              variant="top"
              src={BASE_URL + ASSETS + item.imgUrl}
              className="item-card-img"
            />
            <Card.Body className="item-card-body">
              <Card.Title className="item-card-title">{item.name}</Card.Title>

              <Button
                variant="primary"
                className="add-item"
                model-url={BASE_URL + ASSETS + item.url}
                model-type={item.type}
                model-name={item.name}
              >
                Add Item
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>
    );
  }
}
