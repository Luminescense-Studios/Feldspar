import "../Showcase.css";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Link } from "react-router-dom";

@inject("store")
@observer
class HeroSection extends Component {
  render() {
    // const { store } = this.props;
    return (
      <div>
        {/* ======= Hero Section ======= */}
        <section
          id="hero"
          className="d-flex align-items-center justify-content-center"
        >
          <div className="container position-relative">
            <h1>Welcome to Feldspar</h1>
            <h2>Design your dream home in 3-D</h2>
            <Link to="/">
              <div className="btn-get-started scrollto">Get Started</div>
            </Link>
          </div>
        </section>
        {/* End Hero */}
      </div>
    );
  }
}

export default HeroSection;
