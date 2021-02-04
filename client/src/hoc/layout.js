import React, { Component } from "react";
import Header from "../components/Header_footer/Header";
import Footer from "../components/Header_footer/Footer";

class Layout extends Component {
  render() {
    return (
      <div>
        <Header></Header>
        <div className={"page_container"}>{this.props.children}</div>
        <Footer></Footer>
      </div>
    );
  }
}

export default Layout;
