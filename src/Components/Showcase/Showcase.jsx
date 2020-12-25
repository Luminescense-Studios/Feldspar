import "./Showcase.css";
import React, { Component } from "react";
import Header from "./Header/Header.jsx";
import HeroSection from "./HeroSection/HeroSection.jsx";
import AboutSection from "./AboutSection/AboutSection.jsx";
import PortfolioSection from "./PortfolioSection/PortfolioSection.jsx";
import FAQSection from "./FAQSection/FAQSection.jsx";
import ContactSection from "./ContactSection/ContactSection.jsx";
import Footer from "./Footer/Footer.jsx";
import { inject, observer } from "mobx-react";
import { initGA, PageView } from "../../GATracker/index";
import { TRACKING_ID, GA_OPTIONS } from "../../Constants";

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

        {/* ======= About Section ======= */}
        <AboutSection />
        {/* End About Section */}

        {/* ======= Portfolio Section ======= */}
        <PortfolioSection />
        {/*End Portfolio Section*/}

        {/* ======= Frequently Asked Questions Section ======= */}
        <FAQSection />
        {/*End Frequently Asked Questions Section */}

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
