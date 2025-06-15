// src/components/Accueil/Accueil.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MovieCard from '../MovieCard/MovieCard';
import { POPULAR_MOVIES_URL } from '../../config/api-config';
import { BASE_URL } from '../../config/api-config';
import './Accueil.css';

const Accueil = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await fetch( POPULAR_MOVIES_URL);
        if (!response.ok) throw new Error('Erreur lors du chargement des films');
        const data = await response.json();
        setMovies(data.results || []);
      } catch (err) {
        setError('Impossible de charger les films populaires. Vérifiez votre connexion internet.');
        console.error('Erreur de chargement:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularMovies();
  }, []);

  const handleMovieClick = (movie) => {
    // Stocker les données du film dans le sessionStorage
    sessionStorage.setItem('selectedMovie', JSON.stringify(movie));
    navigate(`/details/${movie.id}`);
  };

  if (loading) {
    return (
      <div className="accueil-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Chargement des films populaires...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="accueil-container">
        <div className="error-container">
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="retry-button"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="accueil-container">
      <header className="accueil-header">
        <h1 className="accueil-title">Films Populaires</h1>
        <p className="accueil-subtitle">Découvrez les films les plus populaires du moment</p>
      </header>
      
      <div className="movies-grid">
        {movies.map(movie => (
          <MovieCard 
            key={movie.id} 
            movie={movie} 
            onClick={handleMovieClick}
          />
        ))}
      </div>
      
      {movies.length === 0 && !loading && !error && (
        <div className="no-movies">
          <p>Aucun film trouvé.</p>
        </div>
      )}
    </div>
  );
};

export default Accueil;