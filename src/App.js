import React, { Component } from "react";
import BluePrintPage from "./Components/BlueprintPage.jsx";
import TopBar from "./Components/TopBar.jsx"
import { inject, observer } from "mobx-react";

@inject("store")
@observer
class App extends Component {
  render() {
    return (
      <div>
        <TopBar />
        <BluePrintPage />
      </div>
    );
  }
}

export default App;
