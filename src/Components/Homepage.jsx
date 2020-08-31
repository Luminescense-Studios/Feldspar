import React, { Component } from "react";
import BluePrintPage from "./BlueprintPage.jsx";
import TopBar from "./TopBar/TopBar.jsx";
import ComingSoonPage from "./ComingSoonPage.jsx";
import { inject, observer } from "mobx-react";

@inject("store")
@observer
class Homepage extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const { store } = this.props;
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <TopBar />
        {this.props.match && (
          <BluePrintPage
            viewKey={this.props.match.params.viewKey}
            addClickListener={store.getClickListener}
          />
        )}
        {!this.props.match && (
          <BluePrintPage
            viewKey=""
            addClickListener={store.getClickListener}
          />
        )}
        <ComingSoonPage />
      </div>
    );
  }
}

export default Homepage;
