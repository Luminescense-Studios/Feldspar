import "../Showcase.css";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import FAQList from "./FAQList.jsx";

@inject("store")
@observer
class FAQSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      faqList: [
        {
          faq: "Can I post my own Furniture models? or my Wallpaper design?",
          text:
            "If you are an enterprise that wants to post 3D models of you Furniture or Wallpaper Designs or Floor textures for promotional purposes, Please email us at luminescence.feldspar@gmail.com and we can make that happen for a small fee.",
        },
        {
          faq: "Why cant I save the designs I created?",
          text:
            "Please Sign In to FeldsparHomes (either directly or using Google Login) and try again.",
        },
        {
          faq: "How much does it cost?",
          text: "Costs absolutely nothing. It is completely free to use.",
        },
      ],
    };
  }

  render() {
    // const { store } = this.props;
    return (
      <div>
        {/* ======= Frequently Asked Questions Section ======= */}
        <section id="faq" className="faq section-bg">
          <div className="container">
            <div className="section-title">
              <h2>Frequently Asked Questions</h2>
              <p>
                Magnam dolores commodi suscipit. Necessitatibus eius consequatur
                ex aliquid fuga eum quidem. Sit sint consectetur velit. Quisquam
                quos quisquam cupiditate. Et nemo qui impedit suscipit alias ea.
                Quia fugiat sit in iste officiis commodi quidem hic quas.
              </p>
            </div>

            <FAQList itemList={this.state.faqList} />
          </div>
        </section>
        {/*End Frequently Asked Questions Section */}
      </div>
    );
  }
}

export default FAQSection;
