import { BrowserRouter, Route, Routes } from "react-router";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./contexts/AuthContext";
import AuthContainer from "./pages/auth/AuthContainer";
import Home from "./pages/Home";
import NowShowingMoviesPage from "./pages/movie/NowShowingMoviesPage";
import UpComingMoviesPage from "./pages/movie/UpComingMoviesPage";
import Promotion from "./pages/promotion/Promotion";
import PromotionDetail from "./pages/promotion/PromotionDetail";
import Ticket from "./pages/ticket/Ticket";
import MovieSeat from "./pages/ticket/MovieSeat";
import Payment from "./pages/ticket/Payment";
import Confirmation from "./pages/ticket/Confirmation";
import UserDetail from "./pages/user/UserDetail";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<AuthContainer />} />
          <Route path="/promotions" element={<Promotion />} />
          <Route path="/promotions/:id" element={<PromotionDetail />} />
          <Route path="/ticket/:id" element={<Ticket />} />
          <Route path="/movie-seat" element={<MovieSeat />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/users">
            <Route path="profile/:userId" element={<UserDetail />} />
          </Route>
          <Route path="/movies">
            <Route path="now-showing" element={<NowShowingMoviesPage />} />
            <Route path="up-coming" element={<UpComingMoviesPage />} />
          </Route>
        </Routes>
      </AuthProvider>
      <ToastContainer />
    </BrowserRouter>
  );
};

export default App;
