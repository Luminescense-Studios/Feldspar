import "./Showcase.css";
import React, { Component } from "react";
import Header from "./Header/Header.jsx";
import HeroSection from "./HeroSection/HeroSection.jsx";
import PortfolioSection from "./PortfolioSection/PortfolioSection.jsx";
import ContactSection from "./ContactSection/ContactSection.jsx";
import Footer from "./Footer/Footer.jsx";
import { inject, observer } from "mobx-react";
import { initGA, PageView } from "../../GATracker/index";
import {TRACKING_ID, GA_OPTIONS} from "../../Constants"

@inject("store")
@observer
class Showcase extends Component {
  componentDidMount() {
    initGA(TRACKING_ID, GA_OPTIONS);
    PageView();
  }

  render() {
    // const { store } = this.props;
    return (
      <div>
        {/*======= Header ======= */}
        <Header />
        {/* End Header */}
        {/* ======= Hero Section ======= */}
        <HeroSection />
        {/* End Hero */}

        {/* ======= Portfolio Section ======= */}
        <PortfolioSection />
        {/*End Portfolio Section*/}

        {/*======= Contact Section =======*/}
        <ContactSection />
        {/*End Contact Section */}

        {/* ======= Footer ======= */}
        <Footer />
        {/* End Footer */}
      </div>
    );
  }
}

export default Showcase;
