import { Movie } from "../types/movie.types";
import { Category } from "../types/category.types";

// Sample categories
export const sampleCategories: Category[] = [
  { categoryId: "cat-1", name: "Action", description: "Phim hành động" },
  { categoryId: "cat-2", name: "Drama", description: "Phim tâm lý" },
  { categoryId: "cat-3", name: "Comedy", description: "Phim hài" },
  { categoryId: "cat-4", name: "Horror", description: "Phim kinh dị" },
  { categoryId: "cat-5", name: "Sci-Fi", description: "Phim khoa học viễn tưởng" },
  { categoryId: "cat-6", name: "Animation", description: "Phim hoạt hình" },
  { categoryId: "cat-7", name: "Adventure", description: "Phim phiêu lưu" },
  { categoryId: "cat-8", name: "Romance", description: "Phim lãng mạn" },
  { categoryId: "cat-9", name: "Thriller", description: "Phim ly kỳ" },
  { categoryId: "cat-10", name: "Fantasy", description: "Phim viễn tưởng" },
];

// Mock movie data - Now Showing (currently running movies)
export const nowShowingMovies: Movie[] = [
  {
    movieId: "movie-1",
    movieName: "Avatar: The Way of Water",
    image: "https://res.cloudinary.com/dwqyqsqmq/image/upload/v1741268234/avatar-way-of-water_kqxtpu.jpg",
    postDate: "2025-12-15T00:00:00.000Z",
    fromDate: "2025-12-20T00:00:00.000Z",
    toDate: "2026-03-31T23:59:59.999Z",
    actors: "Sam Worthington, Zoe Saldana, Sigourney Weaver, Stephen Lang",
    director: "James Cameron",
    rating: "T13",
    duration: 192,
    version: "3D",
    trailer: "https://youtu.be/d9MyW72ELq0",
    content: "Phần tiếp theo của bộ phim Avatar huyền thoại, Jake Sully và gia đình anh phải rời khỏi ngôi nhà của họ và khám phá các vùng của Pandora để tìm nơi trú ẩn an toàn.",
    userId: "user-1",
    categories: [sampleCategories[0], sampleCategories[4], sampleCategories[6]],
    showtimes: []
  },
  {
    movieId: "movie-2",
    movieName: "Black Panther: Wakanda Forever",
    image: "https://res.cloudinary.com/dwqyqsqmq/image/upload/v1741268235/black-panther-wakanda_lmxvhq.jpg",
    postDate: "2025-11-20T00:00:00.000Z",
    fromDate: "2025-12-01T00:00:00.000Z",
    toDate: "2026-02-28T23:59:59.999Z",
    actors: "Letitia Wright, Angela Bassett, Tenoch Huerta, Lupita Nyong'o",
    director: "Ryan Coogler",
    rating: "T13",
    duration: 161,
    version: "2D",
    trailer: "https://youtu.be/_Z3QKkl1WyM",
    content: "Sau cái chết của Vua T'Challa, Nữ hoàng Ramonda, Shuri, M'Baku, Okoye và Dora Milaje chiến đấu để bảo vệ Wakanda khỏi các thế lực thế giới can thiệp.",
    userId: "user-1",
    categories: [sampleCategories[0], sampleCategories[1], sampleCategories[4]],
    showtimes: []
  },
  {
    movieId: "movie-3",
    movieName: "Top Gun: Maverick",
    image: "https://res.cloudinary.com/dwqyqsqmq/image/upload/v1741268236/top-gun-maverick_a8xctk.jpg",
    postDate: "2025-10-15T00:00:00.000Z",
    fromDate: "2025-11-01T00:00:00.000Z",
    toDate: "2026-01-31T23:59:59.999Z",
    actors: "Tom Cruise, Miles Teller, Jennifer Connelly, Jon Hamm",
    director: "Joseph Kosinski",
    rating: "T13",
    duration: 130,
    version: "2D",
    trailer: "https://youtu.be/qSqVVswa420",
    content: "Sau hơn ba thập kỷ phục vụ trong Hải quân, Pete 'Maverick' Mitchell tiếp tục làm phi công thử nghiệm, tránh thăng chức có thể kết thúc sự nghiệp bay của anh.",
    userId: "user-1",
    categories: [sampleCategories[0], sampleCategories[1], sampleCategories[6]],
    showtimes: []
  },
  {
    movieId: "movie-4",
    movieName: "Spider-Man: No Way Home",
    image: "https://res.cloudinary.com/dwqyqsqmq/image/upload/v1741268237/spiderman-no-way-home_yqz8jk.jpg",
    postDate: "2025-09-20T00:00:00.000Z",
    fromDate: "2025-10-15T00:00:00.000Z",
    toDate: "2026-02-15T23:59:59.999Z",
    actors: "Tom Holland, Zendaya, Benedict Cumberbatch, Willem Dafoe",
    director: "Jon Watts",
    rating: "T13",
    duration: 148,
    version: "3D",
    trailer: "https://youtu.be/JfVOs4VSpmA",
    content: "Khi danh tính Spider-Man bị tiết lộ, Peter Parker yêu cầu Doctor Strange giúp đỡ. Khi một phép thuật đi sai hướng, những kẻ thù nguy hiểm từ các thế giới khác bắt đầu xuất hiện.",
    userId: "user-1",
    categories: [sampleCategories[0], sampleCategories[4], sampleCategories[6]],
    showtimes: []
  },
  {
    movieId: "movie-5",
    movieName: "Dune",
    image: "https://res.cloudinary.com/dwqyqsqmq/image/upload/v1741268238/dune_movie_poster_cqxmlr.jpg",
    postDate: "2025-08-10T00:00:00.000Z",
    fromDate: "2025-09-01T00:00:00.000Z",
    toDate: "2026-01-15T23:59:59.999Z",
    actors: "Timothée Chalamet, Rebecca Ferguson, Oscar Isaac, Josh Brolin",
    director: "Denis Villeneuve",
    rating: "T13",
    duration: 155,
    version: "2D",
    trailer: "https://youtu.be/8g18jFHCLXk",
    content: "Câu chuyện về Paul Atreides, một chàng trai tài năng và sáng giá sinh ra với một số phận vĩ đại vượt ra ngoài sự hiểu biết của anh.",
    userId: "user-1",
    categories: [sampleCategories[4], sampleCategories[1], sampleCategories[6]],
    showtimes: []
  },
  {
    movieId: "movie-6",
    movieName: "Encanto",
    image: "https://res.cloudinary.com/dwqyqsqmq/image/upload/v1741268239/encanto_poster_k8mzxt.jpg",
    postDate: "2025-07-15T00:00:00.000Z",
    fromDate: "2025-08-01T00:00:00.000Z",
    toDate: "2025-12-31T23:59:59.999Z",
    actors: "Stephanie Beatriz, María Cecilia Botero, John Leguizamo, Mauro Castillo",
    director: "Byron Howard, Jared Bush",
    rating: "P",
    duration: 102,
    version: "Lồng tiếng",
    trailer: "https://youtu.be/CaimKeDcudo",
    content: "Câu chuyện về một gia đình phi thường sống ẩn mình trong núi Colombia, trong một ngôi nhà ma thuật, ở một thị trấn sôi động gọi là Encanto.",
    userId: "user-1",
    categories: [sampleCategories[5], sampleCategories[2], sampleCategories[9]],
    showtimes: []
  }
];

// Mock movie data - Upcoming (future releases)
export const upcomingMovies: Movie[] = [
  {
    movieId: "movie-7",
    movieName: "The Batman",
    image: "https://res.cloudinary.com/dwqyqsqmq/image/upload/v1741268240/the-batman-poster_hsqkjv.jpg",
    postDate: "2025-01-15T00:00:00.000Z",
    fromDate: "2025-03-15T00:00:00.000Z",
    toDate: "2025-06-15T23:59:59.999Z",
    actors: "Robert Pattinson, Zoë Kravitz, Paul Dano, Jeffrey Wright",
    director: "Matt Reeves",
    rating: "T16",
    duration: 176,
    version: "2D",
    trailer: "https://youtu.be/mqqft2x_Aa4",
    content: "Trong năm thứ hai của mình trong vai hiệp sĩ bóng đêm, Batman khám phá ra sự thối nát ở Gotham City khi theo dõi Riddler, một kẻ giết người hàng loạt đeo mặt nạ.",
    userId: "user-1",
    categories: [sampleCategories[0], sampleCategories[8], sampleCategories[1]],
    showtimes: []
  },
  {
    movieId: "movie-8",
    movieName: "Doctor Strange in the Multiverse of Madness",
    image: "https://res.cloudinary.com/dwqyqsqmq/image/upload/v1741268241/doctor-strange-multiverse_uxvpcn.jpg",
    postDate: "2025-02-01T00:00:00.000Z",
    fromDate: "2025-04-01T00:00:00.000Z",
    toDate: "2025-07-01T23:59:59.999Z",
    actors: "Benedict Cumberbatch, Elizabeth Olsen, Chiwetel Ejiofor, Benedict Wong",
    director: "Sam Raimi",
    rating: "T13",
    duration: 126,
    version: "3D",
    trailer: "https://youtu.be/aWzlQ2N6qqg",
    content: "Doctor Strange khai thác phép thuật cấm hiểm để mở ra đa vũ trụ, bao gồm các thực tế thay thế nơi Scarlet Witch đe dọa toàn nhân loại.",
    userId: "user-1",
    categories: [sampleCategories[0], sampleCategories[4], sampleCategories[9]],
    showtimes: []
  },
  {
    movieId: "movie-9",
    movieName: "Lightyear",
    image: "https://res.cloudinary.com/dwqyqsqmq/image/upload/v1741268242/lightyear-poster_dlvznt.jpg",
    postDate: "2025-02-15T00:00:00.000Z",
    fromDate: "2025-04-15T00:00:00.000Z",
    toDate: "2025-07-15T23:59:59.999Z",
    actors: "Chris Evans, Keke Palmer, Peter Sohn, Taika Waititi",
    director: "Angus MacLane",
    rating: "P",
    duration: 105,
    version: "Lồng tiếng",
    trailer: "https://youtu.be/BwPL0Md_QFQ",
    content: "Câu chuyện về nguồn gốc của Buzz Lightyear, anh hùng đã truyền cảm hứng cho đồ chơi, kể về cuộc phiêu lưu huyền thoại của chiến binh không gian.",
    userId: "user-1",
    categories: [sampleCategories[5], sampleCategories[6], sampleCategories[4]],
    showtimes: []
  },
  {
    movieId: "movie-10",
    movieName: "Minions: The Rise of Gru",
    image: "https://res.cloudinary.com/dwqyqsqmq/image/upload/v1741268243/minions-rise-of-gru_vwhkfc.jpg",
    postDate: "2025-03-01T00:00:00.000Z",
    fromDate: "2025-05-01T00:00:00.000Z",
    toDate: "2025-08-01T23:59:59.999Z",
    actors: "Steve Carell, Pierre Coffin, Alan Arkin, Taraji P. Henson",
    director: "Kyle Balda",
    rating: "P",
    duration: 87,
    version: "Lồng tiếng",
    trailer: "https://youtu.be/6DxjJzmYsXo",
    content: "Trong những năm 1970, Gru đang lớn lên ở vùng ngoại ô và là một fan hâm mộ lớn của một nhóm siêu phản diện được gọi là Vicious 6.",
    userId: "user-1",
    categories: [sampleCategories[5], sampleCategories[2], sampleCategories[6]],
    showtimes: []
  },
  {
    movieId: "movie-11",
    movieName: "Thor: Love and Thunder",
    image: "https://res.cloudinary.com/dwqyqsqmq/image/upload/v1741268244/thor-love-thunder_qhbvry.jpg",
    postDate: "2025-03-15T00:00:00.000Z",
    fromDate: "2025-05-15T00:00:00.000Z",
    toDate: "2025-08-15T23:59:59.999Z",
    actors: "Chris Hemsworth, Natalie Portman, Christian Bale, Tessa Thompson",
    director: "Taika Waititi",
    rating: "T13",
    duration: 119,
    version: "2D",
    trailer: "https://youtu.be/Go8nTmfrQd8",
    content: "Thor bắt đầu một cuộc hành trình khác với Vệ binh Dải ngân hà. Nhưng sự nghỉ ngơi của anh bị gián đoạn bởi Gorr the God Butcher, kẻ tìm cách tiêu diệt các vị thần.",
    userId: "user-1",
    categories: [sampleCategories[0], sampleCategories[2], sampleCategories[4]],
    showtimes: []
  },
  {
    movieId: "movie-12",
    movieName: "Jurassic World Dominion",
    image: "https://res.cloudinary.com/dwqyqsqmq/image/upload/v1741268245/jurassic-world-dominion_nxtphz.jpg",
    postDate: "2025-04-01T00:00:00.000Z",
    fromDate: "2025-06-01T00:00:00.000Z",
    toDate: "2025-09-01T23:59:59.999Z",
    actors: "Chris Pratt, Bryce Dallas Howard, Laura Dern, Sam Neill",
    director: "Colin Trevorrow",
    rating: "T13",
    duration: 147,
    version: "3D",
    trailer: "https://youtu.be/fb5ELWi-ekk",
    content: "Bốn năm sau khi đảo Isla Nublar bị phá hủy, khủng long hiện đang sống và săn mồi cùng với con người trên khắp thế giới.",
    userId: "user-1",
    categories: [sampleCategories[0], sampleCategories[6], sampleCategories[8]],
    showtimes: []
  }
];

// Vietnamese movies
export const vietnameseMovies: Movie[] = [
  {
    movieId: "movie-13",
    movieName: "Mai",
    image: "https://res.cloudinary.com/dwqyqsqmq/image/upload/v1741268246/mai-movie-poster_xvwqzk.jpg",
    postDate: "2025-12-01T00:00:00.000Z",
    fromDate: "2026-01-15T00:00:00.000Z",
    toDate: "2026-04-15T23:59:59.999Z",
    actors: "Phương Anh Đào, Tuấn Trần, Hồng Đào, Việt Hương",
    director: "Trấn Thành",
    rating: "T16",
    duration: 131,
    version: "Phụ đề",
    trailer: "https://youtu.be/kf2RWGb7jCY",
    content: "Câu chuyện về Mai, một cô gái massage, và cuộc đời đầy biến động của cô trong xã hội hiện đại.",
    userId: "user-1",
    categories: [sampleCategories[1], sampleCategories[7]],
    showtimes: []
  },
  {
    movieId: "movie-14",
    movieName: "Cua Lại Vợ Bầu",
    image: "https://res.cloudinary.com/dwqyqsqmq/image/upload/v1741268247/cua-lai-vo-bau_jkmlqp.jpg",
    postDate: "2025-11-15T00:00:00.000Z",
    fromDate: "2025-12-20T00:00:00.000Z",
    toDate: "2026-03-20T23:59:59.999Z",
    actors: "Thái Hòa, Thu Trang, Tiến Luật, Diệu Nhi",
    director: "Nhất Trung",
    rating: "T13",
    duration: 104,
    version: "Phụ đề",
    trailer: "https://youtu.be/XUfQE8V1234",
    content: "Câu chuyện hài hước về một người đàn ông cố gắng cua lại người vợ đang mang thai sau một cuộc cãi vã lớn.",
    userId: "user-1",
    categories: [sampleCategories[2], sampleCategories[7]],
    showtimes: []
  },
  {
    movieId: "movie-15",
    movieName: "Bố Già",
    image: "https://res.cloudinary.com/dwqyqsqmq/image/upload/v1741268248/bo-gia-movie_rxfnmz.jpg",
    postDate: "2025-10-20T00:00:00.000Z",
    fromDate: "2025-11-25T00:00:00.000Z",
    toDate: "2026-02-25T23:59:59.999Z",
    actors: "Trấn Thành, Ngọc Giàu, Võ Minh Lâm, Ngân Chi",
    director: "Trấn Thành",
    rating: "P",
    duration: 128,
    version: "Phụ đề",
    trailer: "https://youtu.be/cauSiPbEgUE",
    content: "Câu chuyện cảm động về tình cha con và những hy sinh thầm lặng của một người cha cho gia đình.",
    userId: "user-1",
    categories: [sampleCategories[1], sampleCategories[2]],
    showtimes: []
  }
];

// Horror movies
export const horrorMovies: Movie[] = [
  {
    movieId: "movie-16",
    movieName: "Scream",
    image: "https://res.cloudinary.com/dwqyqsqmq/image/upload/v1741268249/scream-movie-poster_xbzklw.jpg",
    postDate: "2025-12-10T00:00:00.000Z",
    fromDate: "2026-01-20T00:00:00.000Z",
    toDate: "2026-04-20T23:59:59.999Z",
    actors: "Melissa Barrera, Courtney Cox, David Arquette, Neve Campbell",
    director: "Matt Bettinelli-Olpin, Tyler Gillett",
    rating: "T18",
    duration: 114,
    version: "Phụ đề",
    trailer: "https://youtu.be/beToTslH17s",
    content: "25 năm sau một chuỗi các vụ giết người tàn khốc làm rúng động thị trấn Woodsboro, một kẻ giết người mới đã mặc chiếc mặt nạ Ghostface và bắt đầu nhắm mục tiêu vào một nhóm thanh thiếu niên.",
    userId: "user-1",
    categories: [sampleCategories[3], sampleCategories[8]],
    showtimes: []
  },
  {
    movieId: "movie-17",
    movieName: "The Conjuring: The Devil Made Me Do It",
    image: "https://res.cloudinary.com/dwqyqsqmq/image/upload/v1741268250/conjuring-devil_kmxrty.jpg",
    postDate: "2025-11-25T00:00:00.000Z",
    fromDate: "2026-01-05T00:00:00.000Z",
    toDate: "2026-04-05T23:59:59.999Z",
    actors: "Patrick Wilson, Vera Farmiga, Ruairi O'Connor, Sarah Catherine Hook",
    director: "Michael Chaves",
    rating: "T18",
    duration: 112,
    version: "Phụ đề",
    trailer: "https://youtu.be/YDGw1MTEe9k",
    content: "Ed và Lorraine Warren điều tra một vụ án giết người có thể liên quan đến ma quỷ, đánh dấu lần đầu tiên trong lịch sử Hoa Kỳ một nghi phạm tuyên bố bị quỷ ám.",
    userId: "user-1",
    categories: [sampleCategories[3], sampleCategories[8]],
    showtimes: []
  }
];

// All movies combined
export const allMovies: Movie[] = [
  ...nowShowingMovies,
  ...upcomingMovies,
  ...vietnameseMovies,
  ...horrorMovies
];

// Helper functions to get movies by category
export const getMoviesByCategory = (categoryName: string): Movie[] => {
  return allMovies.filter(movie =>
    movie.categories.some(cat => cat.name.toLowerCase() === categoryName.toLowerCase())
  );
};

export const getMoviesByRating = (rating: string): Movie[] => {
  return allMovies.filter(movie => movie.rating === rating);
};

export const getMoviesByDateRange = (startDate: Date, endDate: Date): Movie[] => {
  return allMovies.filter(movie =>
    new Date(movie.fromDate) >= startDate && new Date(movie.toDate) <= endDate
  );
};

// Random movie selector
export const getRandomMovies = (count: number): Movie[] => {
  const shuffled = [...allMovies].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export default {
  nowShowingMovies,
  upcomingMovies,
  vietnameseMovies,
  horrorMovies,
  allMovies,
  sampleCategories,
  getMoviesByCategory,
  getMoviesByRating,
  getMoviesByDateRange,
  getRandomMovies
};
