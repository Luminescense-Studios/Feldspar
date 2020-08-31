import "../../App.css";
import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { FaLink, FaMinusCircle } from "react-icons/fa";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { VIEW_MODEL, HOST_URL } from "../../Constants";

class CardList extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleShare = this.handleShare.bind(this);
  }

  handleShare() {
    this.props.shareFunc();
  }

  handleRemove(event) {
    this.props.removeFunc(event.target.getAttribute("_id"));
  }

  handleClick(event) {
    this.props.clickFunc(
      event.currentTarget.getAttribute("file-name"),
      event.currentTarget.getAttribute("floor-model-url"),
      event
    );
  }
  render() {
    return (
      <div className="save-file-container">
        {this.props.fileList.map((item, iterator) => (
          <div className="save-file-list-block" key={iterator}>
            <div
              floor-model-url={item.url}
              file-name={item.name}
              email={item.email}
              _id={item._id}
              onClick={(e) => this.handleClick(e)}
              className="save-file-list-item"
            >
              <div className="save-file-name">{item.name}</div>
              <div>
                <CopyToClipboard
                  text={HOST_URL + VIEW_MODEL + item.url}
                  onCopy={this.handleShare}
                >
                  <Button variant="light">
                    <FaLink />
                  </Button>
                </CopyToClipboard>
                <Button
                  _id={item._id}
                  onClick={this.handleRemove}
                  variant="light"
                >
                  <FaMinusCircle />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default CardList;
