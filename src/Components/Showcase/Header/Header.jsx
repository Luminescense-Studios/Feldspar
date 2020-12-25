import "../Showcase.css";
import React, { Component } from "react";
import {
  FELDSPAR,
  BASE_URL,
  ASSETS,
  LOGO_WHITE_NO_MOON,
} from "../../../Constants.js";
import { Navbar, Nav } from "react-bootstrap";
import { inject, observer } from "mobx-react";

@inject("store")
@observer
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isTop: true,
    };
  }
  componentDidMount() {
    document.addEventListener("scroll", () => {
      const isTop = window.scrollY < 100;
      if (isTop) {
        this.setState({ isTop: true });
      } else {
        this.setState({ isTop: false });
      }
    });
  }
  render() {
    // const { store } = this.props;
    return (
      <div id="header">
        <Navbar
          id="header-nav"
          collapseOnSelect
          expand="md"
          variant="dark"
          fixed="top"
          className={this.state.isTop ? "header-transparent" : "header-opaque"}
        >
          <Navbar.Brand href="#hero">
            <img
              src={BASE_URL + ASSETS + LOGO_WHITE_NO_MOON}
              className="top-bar-logo"
              alt=""
            />{" "}
            <h1 className="logo">{FELDSPAR}</h1>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ml-auto text-right">
              <Nav.Link href="#about">About</Nav.Link>
              <Nav.Link href="#portfolio">Portfolio</Nav.Link>
              <Nav.Link href="#faq">FAQ</Nav.Link>
              <Nav.Link href="#contact">Contact</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}

export default Header;
