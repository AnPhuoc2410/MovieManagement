import React, { Component } from 'react'
import ShowTime from '../../components/Ticket/ShowTime'
import Header from '../../components/Homepage/Header'
import Footer from '../../components/Homepage/Footer'

export default class Ticket extends Component {
  render() {
    return (
        <>
        <Header />
        <ShowTime />
        <Footer />
        </>
    )
  }
}
