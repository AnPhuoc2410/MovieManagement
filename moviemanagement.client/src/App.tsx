import { createTheme, ThemeProvider } from "@mui/material";
import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router";
import { ToasterWithMax } from "./components/common/ToasterWithMax";
import Dashboard from "./components/shared/Dashboard";
import PageTransition from "./components/shared/PageTransition";
import SplashCursor from "./components/shared/SplashCursor";
import BuyTicket from "./pages/admin/QuanLyBanVe/SoldTicket";
import ChiTietDatVe from "./pages/admin/QuanLyDatVe/ChiTietDatVe";
import QuanLyDatVe from "./pages/admin/QuanLyDatVe/QuanLyDatVe";
import ThongTinNhanVe from "./pages/admin/QuanLyDatVe/ThongTinNhanVe";
import PromotionDetailManagement from "./pages/admin/QuanLyKhuyenMai/PromotionDetail";
import PromotionManagement from "./pages/admin/QuanLyKhuyenMai/Promotions";
import QuanLiNhanVien from "./pages/admin/QuanLyNhanVien";
import ChinhSuaNhanVien from "./pages/admin/QuanLyNhanVien/ChinhSuaNhanVien";
import ChinhSuaPhim from "./pages/admin/QuanLyPhim/ChinhSuaPhim";
import QuanLyPhim from "./pages/admin/QuanLyPhim/QuanLyPhim";
import ThemPhim from "./pages/admin/QuanLyPhim/ThemPhim";
import ChiTietPhongChieu from "./pages/admin/QuanLyPhongChieu/ChiTietPhongChieu";
import QuanLyPhongChieu from "./pages/admin/QuanLyPhongChieu/QuanLyPhongChieu";
import QuanLiThanhVien from "./pages/admin/QuanLyThanhVien/QuanLiThanhVien";
import ForgotPassword from "./pages/auth/ForgotPassword/ForgotPassword";
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
import ChinhSuaThanhVien from "./pages/admin/QuanLyThanhVien/ChinhSuaThanhVien";
import ThemNhanVienMoi from "./pages/admin/QuanLyNhanVien/ThemNhanVien";
import { LanguageProvider } from "./contexts/LanguageContext";
import AuthForm from "./pages/auth/AuthForm";

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
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <ThemeProvider theme={theme}>
      <LanguageProvider>
        <Routes>
          <Route
            path="/"
            element={
              <SplashCursor
                SPLAT_RADIUS={0.2}
                SPLAT_FORCE={6000}
                COLOR_UPDATE_SPEED={10}
              >
                <Home />
              </SplashCursor>
            }
          />

          <Route path="/auth/*" element={<AuthForm />} />
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
            <Route path="ql-nhan-vien">
              <Route path="" element={<QuanLiNhanVien />} />
              <Route path=":id" element={<ChinhSuaNhanVien />} />
              <Route path="them-moi" element={<ThemNhanVienMoi />} />
            </Route>
            <Route path="ql-thanh-vien">
              <Route path="" element={<QuanLiThanhVien />} />
              <Route path=":id" element={<ChinhSuaThanhVien />} />
            </Route>
            <Route path="ql-phong-chieu">
              <Route path="" element={<QuanLyPhongChieu />} />
              <Route path=":roomId" element={<ChiTietPhongChieu />} />
            </Route>
            <Route path="ql-dat-ve">
              <Route path="" element={<QuanLyDatVe />} />
              <Route path=":bId" element={<ChiTietDatVe />} />
              <Route
                path="thong-tin-nhan-ve/:bId"
                element={<ThongTinNhanVe />}
              />
            </Route>
          </Route>
        </Routes>
        <ToasterWithMax position="top-center" max={3} />
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
