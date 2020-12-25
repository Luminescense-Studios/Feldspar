import "../Showcase.css";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Accordion, Card } from "react-bootstrap";
import {
  FaRegQuestionCircle,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

@inject("store")
@observer
class FAQ extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: false,
    };
  }

  render() {
    // const { store } = this.props;
    return (
      <Accordion>
        <Card className="list-item">
          <Accordion.Toggle
            as={Card.Header}
            eventKey={this.props.iterator}
            onClick={() => {
              this.setState({ isActive: !this.state.isActive });
            }}
          >
            <FaRegQuestionCircle className="icon-help" />
            <div
              className={
                "faq-heading " + (this.state.isActive ? "highlight" : "")
              }
            >
              {this.props.item.faq}
              {!this.state.isActive && <FaChevronDown className="icon-show " />}
              {this.state.isActive && <FaChevronUp className="icon-close " />}
            </div>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={this.props.iterator}>
            <Card.Body>
              <p>{this.props.item.text}</p>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    );
  }
}

export default FAQ;
