import React, { Component } from "react";
import { connect } from "react-redux";
import FormField from '../utils/Form/formfield'

class Login extends Component {
  state = {
    formError: false,
    formSuccess: "",
    formdata: {
      email: {
        element: "imput",
        value: "",
        config: {
          name: "email_input",
          type: "email",
          placeholder: "Enter your email",
        },
        validation: { required: true, email: true },
        valid: false,
        touched: false,
        validationMessage: "",
      },
      password: {
        element: "imput",
        value: "",
        config: {
          name: "password_input",
          type: "password",
          placeholder: "Enter your password",
        },
        validation: { required: true },
        valid: false,
        touched: false,
        validationMessage: "",
      },
    },
  };

  updateForm = () => {
    //
  }

  submitForm = () => {
    //
  }


  render() {
    return (
      <div className="signin_wrapper">
        <form onSubmin={(event) => this.submitForm(event)}>
          <FormField id={'email'} formdata={{this.state.formdata.email}}
          change={(element) => this.updateForm(element)}/>
        </form>
      </div>
    );
  }
}

export default connect()(Login);