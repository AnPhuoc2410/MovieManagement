import React, { Component } from 'react'
import ShowTime from '../../components/ticket/ShowTime'
import ListCinema from  '../../components/ticket/ListCinema'
import Header from '../../components/home/Header'
import Footer from '../../components/home/Footer'
import MovieDetail from '../../components/movie/MovieDetail'

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
