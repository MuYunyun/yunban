import React, { Component } from 'react'
import Header from './header'
import Content from './content'
import Footer from './footer'
class Index extends Component {
  render() {
    return (
      <div>
        <Header />
        <Content />
        <Footer />
      </div>
    );
  }
}

export default Index