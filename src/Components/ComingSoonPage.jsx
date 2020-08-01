import React, { Component } from "react";

export default class ComingSoonPage extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <div className="coming-soon">
        <div className="coming-soon-heading">Coming Soon for Mobile</div>
      </div>
    );
  }
}
