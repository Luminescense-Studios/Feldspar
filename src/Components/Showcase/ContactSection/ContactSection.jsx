import "../Showcase.css";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import Button from "react-bootstrap/Button";
import { validateEmail } from "../../../Utils/Utils.js";
import SmallAlert from "../../SmallAlert.jsx";
import LargeAlert from "../../LargeAlert.jsx";
import axios from "axios";
import { BASE_URL, CONTACT_MESSAGE, CREATE } from "../../../Constants.js";
import { FaCheckCircle } from "react-icons/fa";

@inject("store")
@observer
class ContactSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDisabled: false,

      name: "",
      email: "",
      subject: "",
      message: "",

      buttonText: "Send Message",
      emailError: false,
      messageError: false,
      error: false,
      isSent: false,
    };

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleSubjectChange = this.handleSubjectChange.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.isValidContactMessage = this.isValidContactMessage.bind(this);
  }

  handleNameChange(event) {
    this.setState({ name: event.target.value });
  }

  handleEmailChange(event) {
    if (!validateEmail(event.target.value)) {
      this.setState({ emailError: true });
    } else {
      this.setState({ emailError: false });
    }
    this.setState({ email: event.target.value, error: false });
  }

  handleSubjectChange(event) {
    this.setState({ subject: event.target.value, error: false });
  }

  handleMessageChange(event) {
    if (event.target.value !== "") {
      this.setState({ messageError: false });
    }
    this.setState({ message: event.target.value, error: false });
  }

  handleSubmit() {
    this.setState({ error: false });
    if (this.state.isDisabled) {
      this.setState({ buttonText: "Message Received" });
      return;
    }
    if (this.state.message === "") {
      this.setState({ messageError: true });
    } else {
      this.setState({ messageError: false });
    }
    if (!validateEmail(this.state.email)) {
      this.setState({ emailError: true });
    } else {
      this.setState({ emailError: false });
    }
    if (this.isValidContactMessage()) {
      this.setState({ isDisabled: true, buttonText: "Sending Message..." });
      console.log(this.state);
      axios
        .post(BASE_URL + CONTACT_MESSAGE + CREATE, {
          name: this.state.name,
          email: this.state.email,
          subject: this.state.subject,
          message: this.state.message,
        })
        .then((res) => {
          this.setState({
            isDisabled: true,
            isSent: true,
            error: false,
            buttonText: "Message Received",
          });
          console.log(res.data);
        })
        .catch((err) => {
          this.setState({
            isDisabled: false,
            error: true,
            buttonText: "Send Message",
          });
          console.log(err);
        });
    }
  }

  isValidContactMessage() {
    if (!validateEmail(this.state.email)) {
      return false;
    }
    if (this.state.message === "") {
      return false;
    }
    return true;
  }

  render() {
    // const { store } = this.props;
    return (
      <div>
        {/*======= Contact Section =======*/}
        <section id="contact" className="contact">
          <div className="container">
            <div className="section-title">
              <h2>Contact</h2>
              <p>
                We would love to hear back from you.
                <br></br>
                Like what you see? Share the love with our team
                <br></br>
                We value all feedback, positive and negative. 
                Let us know how we can improve...
              </p>
            </div>

            <div className="row">
              <div className="mx-auto col-lg-8">
                <div className="php-email-form">
                  {!this.state.isSent && (
                    <div>
                      <div className="form-row">
                        <div className="col-md-6 form-group">
                          <input
                            type="text"
                            name="name"
                            className="form-control"
                            id="name"
                            placeholder="Your Name"
                            data-rule="minlen:4"
                            data-msg="Please enter at least 4 chars"
                            onChange={this.handleNameChange}
                          />
                        </div>
                        <div className="col-md-6 form-group">
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            id="email"
                            placeholder="Your Email"
                            data-rule="email"
                            data-msg="Please enter a valid email"
                            onChange={this.handleEmailChange}
                          />
                          {this.state.emailError && (
                            <SmallAlert
                              variant="danger"
                              message="invalid email"
                            />
                          )}
                        </div>
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          name="subject"
                          id="subject"
                          placeholder="Subject"
                          data-rule="minlen:4"
                          data-msg="Please enter at least 8 chars of subject"
                          onChange={this.handleSubjectChange}
                        />
                      </div>
                      <div className="form-group">
                        <textarea
                          className="form-control"
                          name="message"
                          rows="5"
                          data-rule="required"
                          data-msg="Please write something for us"
                          placeholder="Message"
                          onChange={this.handleMessageChange}
                        ></textarea>
                        {this.state.messageError && (
                          <SmallAlert
                            variant="danger"
                            message="message cannot be blank"
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {this.state.error && (
                    <LargeAlert variant="danger" message="Some Error Ocurred" />
                  )}
                  {this.state.isSent && (
                    <div>
                      <div className="php-email-form-success">
                        <FaCheckCircle />
                      </div>
                      <LargeAlert
                        variant="success"
                        message="Your message has been sent. Thank you!"
                      />
                    </div>
                  )}

                  <div className="text-center">
                    <Button
                      variant="danger"
                      className="php-email-form-button"
                      onClick={this.handleSubmit}
                    >
                      {this.state.buttonText}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/*End Contact Section */}
      </div>
    );
  }
}

export default ContactSection;
