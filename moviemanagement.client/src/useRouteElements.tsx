import { lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import Dashboard from "./components/shared/Dashboard";
import { SignalRProvider } from "./contexts/SignalRContext";
import { ProtectedRoute, RejectedRoute } from "./guards/AuthGuard";
import TicketWrapper from "./layouts/TicketWrapper";
import PromotionDetailManagement from "./pages/admin/QuanLyKhuyenMai/PromotionDetail";
import PromotionManagement from "./pages/admin/QuanLyKhuyenMai/Promotions";
import SearchPage from "./pages/movie/SearchPage";
import { Role, UserRole } from "./types/roles.type";

// Lazy load components
const Home = lazy(() => import("./pages/Home/Home"));
const AuthForm = lazy(() => import("./pages/auth/AuthForm"));
const ForgotPassword = lazy(
  () => import("./pages/auth/ForgotPassword/ForgotPassword"),
);

// Admin Pages
const AdminPages = {
  Ticket: {
    BuyTicket: lazy(() => import("./pages/admin/QuanLyBanVe/index")),
    Booking: lazy(() => import("./pages/admin/QuanLyBanVe/ShowTime")),
    Seat: lazy(() => import("./pages/admin/QuanLyBanVe/MovieSeat")),
    Payment: lazy(() => import("./pages/admin/QuanLyBanVe/Payment")),
    Confirmation: lazy(() => import("./pages/admin/QuanLyBanVe/Confirmation")),
  },
  Staff: {
    Management: lazy(() => import("./pages/admin/QuanLyNhanVien")),
    Edit: lazy(() => import("./pages/admin/QuanLyNhanVien/ChinhSuaNhanVien")),
    Add: lazy(() => import("./pages/admin/QuanLyNhanVien/ThemNhanVien")),
  },
  Movie: {
    Management: lazy(() => import("./pages/admin/QuanLyPhim/Movies")),
    Edit: lazy(() => import("./pages/admin/QuanLyPhim/UpdateMovie")),
    Add: lazy(() => import("./pages/admin/QuanLyPhim/AddMovie")),
  },
  Room: {
    Management: lazy(
      () => import("./pages/admin/QuanLyPhongChieu/QuanLyPhongChieu"),
    ),
    Detail: lazy(
      () => import("./pages/admin/QuanLyPhongChieu/ChiTietPhongChieu"),
    ),
  },
  ShowTime: {
    Management: lazy(
      () => import("./pages/admin/QuanLyThoiGianChieu/QuanLiThoiGianChieu"),
    ),
    Detail: lazy(
      () => import("./pages/admin/QuanLyThoiGianChieu/ChiTietThoiGianChieu"),
    ),
    Add: lazy(() => import("./pages/admin/QuanLyThoiGianChieu/ThemThoiGianChieu")),
  },
  Member: {
    Management: lazy(
      () => import("./pages/admin/QuanLyThanhVien/QuanLiThanhVien"),
    ),
    Edit: lazy(() => import("./pages/admin/QuanLyThanhVien/ChinhSuaThanhVien")),
  },
};

// Client Pages
const ClientPages = {
  Movie: {
    NowShowing: lazy(() => import("./pages/movie/NowShowingMoviesPage")),
    Upcoming: lazy(() => import("./pages/movie/UpComingMoviesPage")),
    Search: lazy(() => import("./pages/movie/SearchPage")),
  },
  Promotion: {
    List: lazy(() => import("./pages/promotion/PromotionsPage")),
    Detail: lazy(() => import("./pages/promotion/PromotionDetail")),
  },
  Ticket: {
    Booking: lazy(() => import("./pages/ticket/ShowTime")),
    Seat: lazy(() => import("./pages/ticket/MovieSeat")),
    Payment: lazy(() => import("./pages/ticket/Payment")),
    Confirmation: lazy(() => import("./pages/ticket/Confirmation")),
  },
  User: {
    Profile: lazy(() => import("./pages/user/UserDetail/UserDetail")),
  },
};

export default function useRouteElements() {
  const routeElements = useRoutes([
    // Public Routes
    {
      path: "/",
      element: <Home />,
    },
    // Forgot Password (Public Route)
    {
      path: "/auth/forgot-password",
      element: <ForgotPassword />,
    },
    // Auth Routes (Rejected when authenticated)
    {
      element: <RejectedRoute />,
      children: [
        {
          path: "/auth",
          children: [
            { path: "", element: <AuthForm /> },
            { path: "login", element: <AuthForm /> },
            { path: "signup", element: <AuthForm /> },
          ],
        },
      ],
    },
    // Protected Client Routes
    {
      children: [
        {
          path: "/promotions",
          children: [
            { path: "", element: <ClientPages.Promotion.List /> },
            { path: ":id", element: <ClientPages.Promotion.Detail /> },
          ],
        },
        {
          path: "/movies",
          children: [
            { path: "now-showing", element: <ClientPages.Movie.NowShowing /> },
            { path: "up-coming", element: <ClientPages.Movie.Upcoming /> },
          ],
        },
        {
          path: "search",
          element: <ClientPages.Movie.Search />,
        },
        {
          path: "/ticket",
          element: (
            <SignalRProvider>
              <TicketWrapper />
            </SignalRProvider>
          ),
          children: [
            { path: ":movieId", element: <ClientPages.Ticket.Booking /> },
            {
              path: "movie-seat",
              element: <ProtectedRoute redirectPath="/ticket/movie-seat"/>,
              children: [
                { path: "", element: <ClientPages.Ticket.Seat /> }
              ]
            }, { path: "payment", element: <ClientPages.Ticket.Payment /> },
            {
              path: "confirmation",
              element: <ClientPages.Ticket.Confirmation />,
            },
          ],
        },
      ],
    },
    // Protected Admin Routes
    {
      element: <ProtectedRoute allowedRoles={[Role.Admin]} />,
      children: [
        {
          path: "/admin",
          children: [
            { path: "", element: <Dashboard /> },
            { path: "thong-ke", element: <Dashboard /> },
            {
              path: "khuyen-mai",
              children: [
                { path: "", element: <PromotionManagement /> },
                { path: ":id", element: <PromotionDetailManagement /> },
              ],
            },
            {
              path: "ql-phim",
              children: [
                { path: "", element: <AdminPages.Movie.Management /> },
                { path: ":movieId", element: <AdminPages.Movie.Edit /> },
                { path: "them-phim", element: <AdminPages.Movie.Add /> },
              ],
            },
            {
              path: "ql-ban-ve",
              element: (
                <SignalRProvider>
                  <TicketWrapper />
                </SignalRProvider>
              ),
              children: [
                { path: "", element: <AdminPages.Ticket.BuyTicket /> },
                {
                  path: "ticket/:movieId",
                  element: <AdminPages.Ticket.Booking />,
                },
                { path: "movie-seat", element: <AdminPages.Ticket.Seat /> },
                { path: "payment", element: <AdminPages.Ticket.Payment /> },
                {
                  path: "confirmation",
                  element: <AdminPages.Ticket.Confirmation />,
                },
              ],
            },
            {
              path: "ql-nhan-vien",
              children: [
                { path: "", element: <AdminPages.Staff.Management /> },
                { path: ":id", element: <AdminPages.Staff.Edit /> },
                { path: "them-moi", element: <AdminPages.Staff.Add /> },
              ],
            },
            {
              path: "ql-thanh-vien",
              children: [
                { path: "", element: <AdminPages.Member.Management /> },
                { path: ":id", element: <AdminPages.Member.Edit /> },
              ],
            },
            {
              path: "ql-phong-chieu",
              children: [
                { path: "", element: <AdminPages.Room.Management /> },
                { path: ":roomId", element: <AdminPages.Room.Detail /> },
              ],
            },
            {
              path: "ql-thoi-gian-chieu",
              children: [
                { path: "", element: <AdminPages.ShowTime.Management /> },
                { path: ":id", element: <AdminPages.ShowTime.Detail /> },
                { path: "them-thoi-gian-chieu", element: <AdminPages.ShowTime.Add /> },
              ],
            },
          ],
        },
      ],
    },
    // Protected User Routes
    {
      element: <ProtectedRoute />,
      children: [
        {
          path: "/users",
          children: [
            { path: "profile/:userId", element: <ClientPages.User.Profile /> },
          ],
        },
      ],
    },
    // 404 Route
    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
  ]);

  return routeElements;
}
