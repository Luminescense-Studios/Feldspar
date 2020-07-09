import "../App.css";
import React, { Component } from "react";
import { Card, Button } from "react-bootstrap";

export default class CardList extends Component {
  render() {
    return (
      <div>
        {this.props.itemList.map((item, iterator) => (
          <Card key={iterator} className="item-card">
            <Card.Img
              variant="top"
              src={item.imgUrl}
              className="item-card-img"
            />
            <Card.Body className="item-card-body">
              <Card.Title className="item-card-title">
                {item.modelName}
              </Card.Title>

              <Button
                variant="primary"
                className="add-item"
                model-url={item.modelUrl}
                model-type={item.modelType}
                model-name={item.modelName}
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
