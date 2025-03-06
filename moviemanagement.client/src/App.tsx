import { createTheme, ThemeProvider } from "@mui/material";
import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router";
import ScrollToTop from "./components/common/ScrollToTop";
import { ToasterWithMax } from "./components/common/ToasterWithMax";
import Dashboard from "./components/shared/Dashboard";
import BuyTicket from "./pages/admin/QuanLyBanVe/SoldTicket";
import ChiTietDatVe from "./pages/admin/QuanLyDatVe/ChiTietDatVe";
import QuanLyDatVe from "./pages/admin/QuanLyDatVe/QuanLyDatVe";
import ThongTinNhanVe from "./pages/admin/QuanLyDatVe/ThongTinNhanVe";
import PromotionDetailManagement from "./pages/admin/QuanLyKhuyenMai/PromotionDetail";
import PromotionManagement from "./pages/admin/QuanLyKhuyenMai/Promotions";
import QuanLiNhanVien from "./pages/admin/QuanLyNhanVien";
import ChinhSuaPhim from "./pages/admin/QuanLyPhim/ChinhSuaPhim";
import QuanLyPhim from "./pages/admin/QuanLyPhim/QuanLyPhim";
import ThemPhim from "./pages/admin/QuanLyPhim/ThemPhim";
import ChiTietPhongChieu from "./pages/admin/QuanLyPhongChieu/ChiTietPhongChieu";
import QuanLyPhongChieu from "./pages/admin/QuanLyPhongChieu/QuanLyPhongChieu";
import QuanLiThanhVien from "./pages/admin/QuanLyThanhVien/QuanLiThanhVien";
import LoginForm from "./pages/auth/Login";
import SignupForm from "./pages/auth/Signup";
import Home from "./pages/Home";
import NowShowingMoviesPage from "./pages/movie/NowShowingMoviesPage";
import UpComingMoviesPage from "./pages/movie/UpComingMoviesPage";
import PromotionDetail from "./pages/promotion/PromotionDetail";
import Promotion from "./pages/promotion/PromotionsPage";
import Confirmation from "./pages/ticket/Confirmation";
import Ticket from "./pages/ticket/DateMovie";
import MovieSeat from "./pages/ticket/MovieSeat";
import Payment from "./pages/ticket/Payment";
import UserDetail from "./pages/user/UserDetail/UserDetail";
import AdminTheme from "./shared-theme/AdminTheme";
import SplashCursor from "./components/shared/SplashCursor";

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
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top on route change
  }, [location]);

  return (
    <ThemeProvider theme={theme}>
      <ScrollToTop />
      <SplashCursor />
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

        <Route path="/admin">
          <Route path="" element={<AdminTheme />} />
          <Route path="thong-ke" element={<Dashboard />} />
          <Route path="khuyen-mai">
            <Route path="" element={<PromotionManagement />} />
            <Route path=":id" element={<PromotionDetailManagement />} />
          </Route>
          <Route path="ql-phim">
            <Route path="" element={<QuanLyPhim />} />
            <Route path=":id" element={<ChinhSuaPhim />} />
            <Route path="them-phim" element={<ThemPhim />} />
          </Route>
          <Route path="ban-ve" element={<BuyTicket />} />
          <Route path="ql-nhan-vien" element={<QuanLiNhanVien />} />
          <Route path="ql-thanh-vien" element={<QuanLiThanhVien />} />
          <Route path="ql-phong-chieu">
            <Route path="" element={<QuanLyPhongChieu />} />
            <Route path=":roomId" element={<ChiTietPhongChieu />} />
          </Route>
          <Route path="ql-dat-ve">
            <Route path="" element={<QuanLyDatVe />} />
            <Route path=":bId" element={<ChiTietDatVe />} />
            <Route path="thong-tin-nhan-ve/:bId" element={<ThongTinNhanVe />} />
          </Route>
        </Route>
      </Routes>
      <ToasterWithMax position="top-center" max={3} />
    </ThemeProvider>
  );
};

export default App;
