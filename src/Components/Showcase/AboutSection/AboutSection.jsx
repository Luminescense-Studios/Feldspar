import "../Showcase.css";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { FaBullseye, FaSeedling } from "react-icons/fa";

@inject("store")
@observer
class AboutSection extends Component {
  render() {
    // const { store } = this.props;
    return (
      <div>
        {/* ======= About Section ======= */}
        <section id="about" className="about section-bg">
          <div className="container">
            <div className="row">
              <div className="col-lg-6">
                <img
                  src="https://www.feldsparhomes.com:8001/assets/5fdeebcf276a30076006f4ee"
                  className="img-fluid"
                  alt="About"
                />
              </div>
              <div className="col pt-4 pt-lg-0">
                <h3>About Feldspar</h3>
                <p>
                  Create 3D design models of your Dream Home and share them with
                  your friends and architects in a single link. Since its not
                  always easy to imagine what a drawing will transform into a
                  house, this helps in Visualization.
                  <br />
                  <br />
                  This is an Open Source Software Project started to spread the
                  knowledge among Computer Software Enthusiasts who are
                  interested in learning how Architectural Software or any 3D
                  Design Software is made. Ofcourse this project is not on par
                  with many of the open source 3D design tools available, this
                  was always designed so that a new comer will can understand
                  the basic mathematics that gos on behind the scenes. Anyone
                  can contribute to this project.
                </p>
                <div className="row">
                  <div className="col-md-6">
                    <div className="icon">
                      <FaBullseye />
                    </div>
                    <h4>Our Goal</h4>
                    <p>
                      To help in visualizing and contactualizing any home
                      construction projects. And spread the knowledge about
                      Computer Software.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="icon">
                <FaSeedling />
              </div>
              <h4>Our Story</h4>
              <p>
                When I wanted to demolish the house that my grandfather built in
                1980 and reconstruct it on the same ground, I found it extremely
                tough to visualize what the final product would look like. I'm
                not blessed with a large plot of land and so to maximize the
                area, we had to put alot of thought into placing and building
                custom furniture to fit into the available space. While I am
                happy with the final result, My hope is that this software makes
                future projects easier to carry out.
              </p>
            </div>
          </div>
        </section>
        {/* End About Section */}
      </div>
    );
  }
}

export default AboutSection;
