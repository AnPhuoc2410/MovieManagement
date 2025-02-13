import Footer from "../../components/home/Footer";
import Header from "../../components/home/Header";
import MovieDetail from "../../components/Movie/MovieDetail";
import ListCinema from "../../components/Ticket/ListCinema";
import ShowTime from "../../components/Ticket/ShowTime";
const Ticket = () => {
  return (
    <>
      <Header />
      <MovieDetail />
      <ShowTime />
      <ListCinema />
      <Footer />
    </>
  );
};

export default Ticket;
