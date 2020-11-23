import "../Showcase.css";
import React, { Component } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";

class PortfolioSection extends Component {
  render() {
    // const { store } = this.props;
    let listItems = this.props.portfolioItems.map((item, idx) => {
      return (
        <div key={idx} className="col-lg-4 col-md-6 portfolio-item filter-app">
          <a target="_blank" href={item.url} rel="noopener noreferrer">
            <img src={item.imgUrl} className="img-fluid" alt="IMG"></img>
            <div className="portfolio-info">
              <h4>{item.title}</h4>
              <div style={{ display: "inline", color: "#ffffff" }}>
                {item.description}
                <div style={{ display: "inline-block", marginLeft: "1rem" }}>
                  <FaExternalLinkAlt />
                </div>
              </div>
            </div>
          </a>
        </div>
      );
    });
    return <div className="row portfolio-container">{listItems}</div>;
  }
}

export default PortfolioSection;
