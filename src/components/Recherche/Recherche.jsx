import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Recherche.css';
import { searchBar } from '../../config/api-config';
import CarteFilm from '../CarteFilm/CarteFilm';
import { useQuery } from '@tanstack/react-query';
import { getCustomMovies } from '../../services/customMoviesService';

const fetchMovies = async (query) => {
  if (!query) return [];

  const response = await fetch(`${searchBar}&query=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error('Erreur lors de la recherche');

  const data = await response.json();
  const apiMovies = data.results || [];

  const matchingCustom = getCustomMovies().filter(movie =>
    movie.title.toLowerCase().includes(query.toLowerCase())
  );

  return [...matchingCustom, ...apiMovies];
};

const Recherche = () => {
  const navigate = useNavigate();
  const storedQuery = sessionStorage.getItem('searchQuery') || '';

  const {
    data: movies = [],
    isLoading,
    isError,
    error,
    isSuccess
  } = useQuery({
    queryKey: ['search', storedQuery],
    queryFn: () => fetchMovies(storedQuery),
    enabled: !!storedQuery
  });

  const handleMovieClick = (movie) => {
    sessionStorage.setItem('selectedMovie', JSON.stringify(movie));
    navigate(`/details/${movie.id}`);
  };

  return (
    <div className="recherche-container">


      <div className="results-section">
        
        {!isLoading && isSuccess && movies.length === 0 && !isError && (
          <div className="no-results">
            <span className="no-results-icon">🎬</span>
            <h3>Aucun film trouvé</h3>
            <p>Essayez avec d'autres mots-clés</p>
          </div>
        )}

        {isSuccess && movies.length > 0 && (
          <>
            <div className="section-header">
              <h2 className="results-title">Résultats de recherche ({movies.length})</h2>
              <p className="results-subtitle">
                Recherche pour : "<strong>{storedQuery}</strong>"
              </p>
            </div>

            <div className="movies-grid">
              {movies.map(movie => (
                <CarteFilm key={movie.id} movie={movie} onClick={handleMovieClick} />
              ))}
            </div>
          </>
        )}

        {isError && <p className="search-error">{error.message}</p>}
      </div>
    </div>
  );
};

export default Recherche;
