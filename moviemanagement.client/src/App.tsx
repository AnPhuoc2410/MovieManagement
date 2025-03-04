import { createTheme, ThemeProvider } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router";
import { ToastContainer } from "react-toastify";
import ScrollToTop from "./components/common/ScrollToTop";
import { AuthProvider } from "./contexts/AuthContext";
import Dashboard from "./pages/admin/Dashboard";
import Movies from "./pages/admin/Movies";
import PromotionDetailManagement from "./pages/admin/PromotionDetail";
import Promotion from "./pages/promotion/PromotionsPage";
import PromotionManagement from "./pages/admin/Promotions";
import BuyTicket from "./pages/admin/QuanLyBanVe/SoldTicket";
import QuanLiNhanVien from "./pages/admin/QuanLyNhanVien";
import QuanLiThanhVien from "./pages/admin/QuanLyThanhVien/QuanLiThanhVien";
import LoginForm from "./pages/auth/Login";
import SignupForm from "./pages/auth/Signup";
import Home from "./pages/Home";
import NowShowingMoviesPage from "./pages/movie/NowShowingMoviesPage";
import UpComingMoviesPage from "./pages/movie/UpComingMoviesPage";
import PromotionDetail from "./pages/promotion/PromotionDetail";
import Ticket from "./pages/ticket/ShowTime";
import MovieSeat from "./pages/ticket/MovieSeat";
import Payment from "./pages/ticket/Payment";
import UserDetail from "./pages/user/UserDetail/UserDetail";
import AdminTheme from "./shared-theme/AdminTheme";
import Confirmation from "./pages/ticket/Confirmation";
import QuanLyPhongChieu from "./pages/admin/QuanLyPhongChieu/QuanLyPhongChieu";
import ChiTietPhongChieu from "./pages/admin/QuanLyPhongChieu/ChiTietPhongChieu";
import QuanLyDatVe from "./pages/admin/QuanLyDatVe/QuanLyDatVe";
import ChiTietDatVe from "./pages/admin/QuanLyDatVe/ChiTietDatVe";

const theme = createTheme({
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: "none",
          "&:hover": {
            textDecoration: "none", // also remove underline on hover
          },
        },
      },
    },
  },
});

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth">
              <Route path="login" element={<LoginForm />} />
              <Route path="signup" element={<SignupForm />} />
            </Route>
            <Route path="/promotions" element={<Promotion />} />
            <Route path="/promotions/:id" element={<PromotionDetail />} />
            <Route path="/showtime/:id" element={<Ticket />} />
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

            <Route path="/admin" element={<AdminTheme />}>
              <Route path="thong-ke" element={<Dashboard />} />
              <Route path="khuyen-mai" element={<PromotionManagement />} />
              <Route path="phim" element={<Movies />} />
              <Route path="ban-ve" element={<BuyTicket />} />
              <Route
                path="khuyen-mai/:id"
                element={<PromotionDetailManagement />}
              />
              <Route path="ql-nhan-vien" element={<QuanLiNhanVien />} />
              <Route path="ql-thanh-vien" element={<QuanLiThanhVien />} />
              <Route path="ql-phong-chieu">
                <Route path="" element={<QuanLyPhongChieu />} />
                <Route path=":roomId" element={<ChiTietPhongChieu />} />
              </Route>
              <Route path="ql-dat-ve">
                <Route path="" element={<QuanLyDatVe />} />
                <Route path=":bId" element={<ChiTietDatVe />} />
              </Route>
            </Route>
          </Routes>
        </ThemeProvider>
      </AuthProvider>
      <ToastContainer />
    </BrowserRouter>
  );
};

export default App;
