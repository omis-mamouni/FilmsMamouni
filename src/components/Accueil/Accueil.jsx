// Accueil.jsx
import React from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import CarteFilm from '../CarteFilm/CarteFilm';
import './Accueil.css';

// 📦 Récupération des films populaires via API TMDB
const fetchMovies = async ({ pageParam = 1 }) => {
  const url = `https://api.themoviedb.org/3/movie/popular?language=fr-FR&page=${pageParam}&api_key=${import.meta.env.VITE_TMDB_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Erreur chargement populaires');
  const data = await res.json();
  return { results: data.results, nextPage: pageParam + 1, totalPages: data.total_pages };
};

// ⭐ Récupération des films les mieux notés
const fetchTopRated = async () => {
  const res = await fetch(`https://api.themoviedb.org/3/movie/top_rated?language=fr-FR&page=1&api_key=${import.meta.env.VITE_TMDB_API_KEY}`);
  if (!res.ok) throw new Error('Erreur Top Rated');
  const data = await res.json();
  return data.results;
};

const Accueil = () => {
  const navigate = useNavigate();

  // 🔄 Infinite Query : Films populaires
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['movies-home'],
    queryFn: fetchMovies,
    getNextPageParam: (lastPage) => {
      return lastPage.nextPage <= lastPage.totalPages ? lastPage.nextPage : undefined;
    }
  });

  // ⭐ Top rated films
  const {
    data: topRated,
    isLoading: loadingTop,
    isError: errorTop
  } = useQuery({
    queryKey: ['top-rated'],
    queryFn: fetchTopRated
  });

  const movies = data?.pages.flatMap(page => page.results) || [];

  // 🎬 Gestion du clic sur un film
  const handleMovieClick = (movie) => {
    sessionStorage.setItem('selectedMovie', JSON.stringify(movie));
    navigate(`/details/${movie.id}`);
  };

  return (
    <div className="accueil-container">

      {/* 🎥 Bande section : Films populaires */}
      <div className="section-header">
        <h1 className="accueil-title">Films Populaires ({movies.length})</h1>
        <p className="accueil-subtitle">Découvrez les films les plus populaires du moment</p>
      </div>

      {isLoading && <p>Chargement des films...</p>}
      {isError && <p>Erreur : {error.message}</p>}

      <div className="movies-grid">
        {movies.map(movie => (
          <CarteFilm key={movie.id} movie={movie} onClick={handleMovieClick} />
        ))}
      </div>

      {/* 🔘 Bouton de chargement */}
      {hasNextPage && (
        <div className="load-more-container">
          <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} className="load-more-button">
            {isFetchingNextPage ? 'Chargement...' : 'Charger plus'}
          </button>
        </div>
      )}

      {/* ⭐ Section Top Rated */}
      <div className="section-header" style={{ marginTop: '3rem' }}>
        <h2 className="accueil-title">Top Rated Films</h2>
        <p className="accueil-subtitle">Les mieux notés par les spectateurs</p>
      </div>

      {loadingTop && <p>Chargement des films top rated...</p>}
      {errorTop && <p>Erreur lors du chargement top rated</p>}

      <div className="movies-grid">
        {topRated?.map(movie => (
          <CarteFilm key={movie.id} movie={movie} onClick={handleMovieClick} />
        ))}
      </div>
    </div>
  );
};

export default Accueil;
