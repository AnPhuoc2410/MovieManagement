import { http, HttpResponse } from "msw";
import { Category } from "../../types/category.types";

export const handleGetCategoryList = () => {
  return http.get("/api/categories", () => {
    return HttpResponse.json<Category[]>([
      {
        categoryId: "1",
        name: "Hành động",
      },
      {
        categoryId: "2",
        name: "Viễn tưởng",
      },
      {
        categoryId: "3",
        name: "Hoạt hình",
      },
      {
        categoryId: "4",
        name: "Võ thuật",
      },
      {
        categoryId: "5",
        name: "Hài hước",
      },
      {
        categoryId: "6",
        name: "Chiến tranh",
      },
      {
        categoryId: "7",
        name: "Kinh dị",
      },
      {
        categoryId: "8",
        name: "Kinh điển",
      },
      {
        categoryId: "9",
        name: "Lãng mạn",
      },
      {
        categoryId: "10",
        name: "Kiếm hiệp",
      },
      {
        categoryId: "11",
        name: "Phiêu lưu",
      },
      {
        categoryId: "12",
        name: "Tâm lý",
      },
      {
        categoryId: "13",
        name: "Tình cảm",
      },
      {
        categoryId: "14",
        name: "Âm nhạc",
      },
    ]);
  });
};
