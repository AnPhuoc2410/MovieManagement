import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../apis/axios.config";
import NowShowingMovies from "../../components/Movie/NowShowingMovies";
import Loader from "../../components/shared/Loading";
import ListMovieLayout from "../../layouts/ListMovieLayout";

const NowShowingMoviesPage: React.FC = () => {
  const { t } = useTranslation();
  const [nowShowingMovies, setNowShowingMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // For API pagination
  const apiPage = 0;
  const apiPageSize = 100; // Fetch more to handle client-side pagination

  useEffect(() => {
    const fetchNowShowingMovies = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/movie/showing/page/${apiPage}/size/${apiPageSize}`);
        console.log("Now showing movies:", response.data);
        setNowShowingMovies(response.data);
      } catch (error) {
        console.error("Error fetching now showing movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNowShowingMovies();
  }, [t]);

  if (loading) {
    return <Loader />;
  }

  return (
    <ListMovieLayout>
      <NowShowingMovies />
    </ListMovieLayout>
  );
};

export default NowShowingMoviesPage;
