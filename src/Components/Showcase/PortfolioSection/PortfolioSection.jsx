import "../Showcase.css";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import PortfolioItems from "./PortfolioItems.jsx";

@inject("store")
@observer
class PortfolioSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      portfolioItems: [
        {
          imgUrl:
            "https://www.feldsparhomes.com:8001/assets/5fa0318c59425f0416dded35",
          title: "Minimal Bathroom 1",
          description: "view in 3D",
          url: "https://www.feldsparhomes.com/view/5f780542c7df38042b904b49",
        },
        {
          imgUrl:
            "https://www.feldsparhomes.com:8001/assets/5fa0306359425f0416dded33",
          title: "Minimal Bedroom",
          description: "view in 3D",
          url: "https://www.feldsparhomes.com/view/5f6e19b60ef99d0432c231d5",
        },

        {
          imgUrl:
            "https://www.feldsparhomes.com:8001/assets/5fa031df59425f0416dded36",
          title: "Minimal Bathroom 2",
          description: "view in 3D",
          url: "https://www.feldsparhomes.com/view/5f780912c7df38042b904b4b",
        },
        {
          imgUrl:
            "https://www.feldsparhomes.com:8001/assets/5fa0322259425f0416dded37",
          title: "Child's Playroom",
          description: "view in 3D",
          url: "https://www.feldsparhomes.com/view/5f78161fc7df38042b904b4c",
        },
        {
          imgUrl:
            "https://www.feldsparhomes.com:8001/assets/5fa0314859425f0416dded34",
          title: "Kitchen & Dining",
          description: "view in 3D",
          url: "https://www.feldsparhomes.com/view/5f7039920ef99d0432c231de",
        },
        {
          imgUrl:
            "https://www.feldsparhomes.com:8001/assets/5fa0327459425f0416dded38",
          title: "Serene Apartment",
          description: "view in 3D",
          url: "https://www.feldsparhomes.com/view/5f781cf8c7df38042b904b4d",
        },
      ],
    };
  }

  render() {
    // const { store } = this.props;
    return (
      <div>
        {/* ======= Portfolio Section ======= */}
        <section id="portfolio" className="portfolio">
          <div className="container">
            <div className="section-title">
              <h2>Portfolio</h2>
              <p>
                View curated designs in 3D and get a glimpse of what is possible.
                Let your imagination run wild and design your Dream Home...
              </p>
            </div>

            <PortfolioItems portfolioItems={this.state.portfolioItems} />
          </div>
        </section>
        {/*End Portfolio Section*/}
      </div>
    );
  }
}

export default PortfolioSection;
