import React, { Component } from "react";
import BluePrintPage from "./Components/BlueprintPage.jsx";
import TopBar from "./Components/TopBar/TopBar.jsx";
import ComingSoonPage from "./Components/ComingSoonPage.jsx";
import { inject, observer } from "mobx-react";

@inject("store")
@observer
class App extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const { store } = this.props;
    return (
      <div style={{width: "100%", height: "100%"}}>
        <TopBar />
        <BluePrintPage addClickListener={store.getClickListener}/>
        <ComingSoonPage />
      </div>
    );
  }
}

export default App;
