import { BrowserRouter, Route, Routes } from "react-router";
import { AuthProvider } from "./contexts/AuthContext";
import AuthContainer from "./pages/auth/AuthContainer";
import Home from "./pages/Home";
import Promotion from "./pages/promotion/Promotion";
import PromotionDetail from "./pages/promotion/PromotionDetail";
import Ticket from "./pages/ticket/Ticket";
import NowShowingMoviesPage from "./pages/movie/NowShowingMoviesPage";
import UpComingMoviesPage from "./pages/movie/UpComingMoviesPage";
import MovieDetail from "./components/Movie/MovieDetail";

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
          <Route path="/movies">
            <Route path="now-showing" element={<NowShowingMoviesPage />} />
            <Route path="up-coming" element={<UpComingMoviesPage />} />
          </Route>
          <Route path="/movie/:id" element={<MovieDetail />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
