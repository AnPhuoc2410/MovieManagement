import { http, HttpResponse } from "msw";
import { Room } from "../../types/room.types";
import { XacNhanDatVe } from "../../pages/admin/QuanLyDatVe/ChiTietDatVe";
import { Movie, QuanLyPhimType } from "../../types/movie.types";

export const handleGetRoom = () => {
  return http.get("/api/phong-chieu", () => {
    return HttpResponse.json<Room[]>([
      {
        roomId: "1",
        name: "Room 1",
        row: 5,
        column: 10,
        total: 50,
      },
      {
        roomId: "2",
        name: "Room 2",
        row: 6,
        column: 12,
        total: 72,
      },
      {
        roomId: "3",
        name: "Room 3",
        row: 7,
        column: 14,
        total: 98,
      },
    ]);
  });
};

export const handleGetRoomDetail = (roomId: string) => {
  return http.get(`/api/phong-chieu/${roomId}`, () => {
    switch (roomId) {
      case "1":
        return HttpResponse.json<Room>({
          roomId: "1",
          name: "Room 1",
          row: 5,
          column: 10,
          total: 50,
        });
      case "2":
        return HttpResponse.json<Room>({
          roomId: "2",
          name: "Room 2",
          row: 6,
          column: 12,
          total: 72,
        });
      case "3":
        return HttpResponse.json<Room>({
          roomId: "3",
          name: "Room 3",
          row: 7,
          column: 14,
          total: 98,
        });
      default:
        return HttpResponse.error();
    }
  });
};

export const handleGetBookingDetail = (bookingId: string) => {
  return http.get(`/api/booking/${bookingId}`, () => {
    return HttpResponse.json<XacNhanDatVe>({
      mName: "Đại chiến giữa những vì sao",
      monitor: "Scrn02",
      datePremiere: "25-01-2017",
      timePremiere: "08-20",
      seat: ["B8", "B9", "B10", "C10"],
      price: ["B8: 45000đ", "B8: 45000đ", "B8: 45000đ"],
      total: 180000,
      MaThanhVien: "TV0000012",
      CMND: "191816354",
      HoTen: "Nguyễn Văn A",
      DiemThanhVien: 1200,
      changeTicket: [0, 1, 2],
      SoDienThoai: "0901234567",
      MovieBanner:
        "https://images.unsplash.com/photo-1578632749014-ca77efd052eb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    });
  });
};

export const handleGetFilmList = (query: string) => {
  return http.get(`/api/films?query=${query}`, () => {
    switch (query) {
      case "all":
        return HttpResponse.json<QuanLyPhimType[]>([
          {
            movieId: "1",
            name: "SCANDAL",
            postDate: new Date("2021-12-01"),
            director: "Shusuke Kaneko",
            duration: 221,
            version: 2,
          },
          {
            movieId: "2",
            name: "Spider man",
            postDate: new Date("2021-12-01"),
            director: "Shusuke Kaneko",
            duration: 213,
            version: 2,
          },
        ]);

      default:
        return HttpResponse.error();
    }
  });
};

export const handleGetFilmDetail = (id: string) => {
  return http.get(`/api/films/${id}`, () => {
    switch (id) {
      case "1":
        return HttpResponse.json<Movie>({
          movieId: "1",
          name: "SCANDAL",
          image: "https://via.placeholder.com/150",
          postDate: new Date("2021-12-01"),
          fromDate: new Date("2021-12-01"),
          toDate: new Date("2021-12-01"),
          actors: "Shusuke Kaneko",
          director: "Shusuke Kaneko",
          rating: "5",
          duration: 221,
          version: 2,
          trailer: "https://www.youtube.com/watch?v=1",
          content: "A great movie",
          categories: [
            {
              categoryId: "1",
              name: "Action",
              description: "Hehehehe",
            },
            {
              categoryId: "2",
              name: "Action",
              description: "Hehehehe",
            },
            {
              categoryId: "3",
              name: "Action",
              description: "Hehehehe",
            },
          ],
          showtimes: [
            {
              showTimeId: "1",
              movieId: "1",
              roomId: "1",
              startTime: new Date("2021-12-01"),
            },
          ],
        });

      case "2":
        return HttpResponse.json<Movie>({
          movieId: "2",
          name: "Spider man",
          image: "https://via.placeholder.com/150",
          postDate: new Date("2021-12-01"),
          fromDate: new Date("2021-12-01"),
          toDate: new Date("2021-12-01"),
          actors: "Shusuke Kaneko",
          director: "Shusuke Kaneko",
          rating: "5",
          duration: 221,
          version: 2,
          trailer: "https://www.youtube.com/watch?v=1",
          content: "A great movie",
          categories: [
            {
              categoryId: "1",
              name: "Action",
              description: "Hehehehe",
            },
            {
              categoryId: "2",
              name: "Action",
              description: "Hehehehe",
            },
            {
              categoryId: "3",
              name: "Action",
              description: "Hehehehe",
            },
          ],
          showtimes: [
            {
              showTimeId: "1",
              movieId: "1",
              roomId: "1",
              startTime: new Date("2021-12-01"),
            },
          ],
        });
      default:
        return HttpResponse.error();
    }
  });
};
