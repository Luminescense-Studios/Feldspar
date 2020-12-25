import "../Showcase.css";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import FAQ from "./FAQ.jsx";

@inject("store")
@observer
class FAQList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    // const { store } = this.props;
    return (
      <div className="faq-list">
        {this.props.itemList.map((item, iterator) => (
          <div key={iterator}>
            <FAQ item={item} iterator={iterator} />
          </div>
        ))}
      </div>
    );
  }
}

export default FAQList;
