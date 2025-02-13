import React, { Component } from 'react'
import ShowTime from '../../components/Ticket/ShowTime'
import ListCinema from '../../components/Ticket/ListCinema'
import Header from '../../components/Homepage/Header'
import Footer from '../../components/Homepage/Footer'
import MovieDetail from '../../components/Movie/MovieDetail'

export default class Ticket extends Component {
  render() {
    return (
        <>
        <Header />
        <MovieDetail />
        <ShowTime />
        <ListCinema />
        <Footer />
        </>
    )
  }
}
