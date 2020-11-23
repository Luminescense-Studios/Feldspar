import "../../App.css";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Tabs, Tab } from "react-bootstrap";
import ItemCards from "./ItemCards.jsx";
import {
  SOFA_CATEGORY,
  CHAIR_CATEGORY,
  BED_CATEGORY,
  ARCH_CATEGORY,
  MISC_CATEGORY,
  KITCHEN_CATEGORY,
  RUG_CATEGORY,
  TABLE_CATEGORY,
  CABINET_CATEGORY,
  CURTAIN_CATEGORY,
  LIGHT_CATEGORY,
  BATH_CATEGORY,
} from "../../Constants.js";

@inject("store")
@observer
class ItemsTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key: "sofa",
    };
  }
  
  render() {
    const { store } = this.props;
    return (
      <div id="add-items">
        <Tabs
          variant="pills"
          id="controlled-tab-example"
          activeKey={this.state.key}
          onSelect={(k) => {
            this.setState({ key: k });
          }}
        >
          <Tab eventKey="sofa" title="Sofas">
            <ItemCards category={SOFA_CATEGORY} loggedIn={store.getLoggedIn} />
          </Tab>
          <Tab eventKey="chair" title="Chairs">
            <ItemCards category={CHAIR_CATEGORY} loggedIn={store.getLoggedIn} />
          </Tab>
          <Tab eventKey="table" title="Tables">
            <ItemCards category={TABLE_CATEGORY} loggedIn={store.getLoggedIn} />
          </Tab>
          <Tab eventKey="bed" title="Beds">
            <ItemCards category={BED_CATEGORY} loggedIn={store.getLoggedIn} />
          </Tab>
          <Tab eventKey="rug" title="Rugs">
            <ItemCards category={RUG_CATEGORY} loggedIn={store.getLoggedIn} />
          </Tab>
          <Tab eventKey="misc" title="Misc">
            <ItemCards category={MISC_CATEGORY} loggedIn={store.getLoggedIn} />
          </Tab>
          <Tab eventKey="cabinet" title="Cabinets">
            <ItemCards
              category={CABINET_CATEGORY}
              loggedIn={store.getLoggedIn}
            />
          </Tab>
          <Tab eventKey="bath" title="Bath">
            <ItemCards category={BATH_CATEGORY} loggedIn={store.getLoggedIn} />
          </Tab>
          <Tab eventKey="curtain" title="Curtains">
            <ItemCards
              category={CURTAIN_CATEGORY}
              loggedIn={store.getLoggedIn}
            />
          </Tab>
          <Tab eventKey="light" title="Lights">
            <ItemCards category={LIGHT_CATEGORY} loggedIn={store.getLoggedIn} />
          </Tab>
          <Tab eventKey="kitchen" title="Kitchen">
            <ItemCards
              category={KITCHEN_CATEGORY}
              loggedIn={store.getLoggedIn}
            />
          </Tab>
          <Tab eventKey="arch" title="Architectural">
            <ItemCards category={ARCH_CATEGORY} loggedIn={store.getLoggedIn} />
          </Tab>
        </Tabs>
      </div>
    );
  }
}

export default ItemsTab;
