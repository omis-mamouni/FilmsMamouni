// DetailsFilm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './DetailsFilm.css';
import { API_KEY } from '../../config/api-config';


// Configuration API
const MOVIE_DETAILS_URL = (movieId) => `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`;
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const DetailsFilm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        setError('');
        
        // D'abord, essayer de récupérer les données du sessionStorage
        const storedMovie = sessionStorage.getItem('selectedMovie');
        if (storedMovie) {
          const movie = JSON.parse(storedMovie);
          setMovieDetails(movie);
          
          // Si ce n'est pas un film personnalisé, récupérer les détails complets
          if (!movie.isCustom && id) {
            const response = await fetch(MOVIE_DETAILS_URL(id));
            if (response.ok) {
              const data = await response.json();
              setMovieDetails(data);
            }
          }
        } else if (id) {
          // Si pas de données stockées, récupérer directement les détails
          const response = await fetch(MOVIE_DETAILS_URL(id));
          if (!response.ok) throw new Error('Film non trouvé');
          const data = await response.json();
          setMovieDetails(data);
        } else {
          throw new Error('Aucune information de film disponible');
        }
      } catch (err) {
        setError('Impossible de charger les détails du film');
        console.error('Erreur détails film:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const handleBack = () => {
    navigate(-1); // Retour à la page précédente
  };

  if (loading) {
    return (
      <div className="details-film-container">
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Chargement des détails...</p>
        </div>
      </div>
    );
  }

  if (error || !movieDetails) {
    return (
      <div className="details-film-container">
        <div className="error-container">
          <div className="error-message">
            <span className="error-icon">❌</span>
            <p>{error || 'Film non trouvé'}</p>
            <button onClick={handleBack} className="back-button">
              Retour
            </button>
          </div>
        </div>
      </div>
    );
  }

  const defaultImage = `data:image/svg+xml,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600"><rect width="400" height="600" fill="#e5e7eb"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="60" fill="#9ca3af">🎬</text></svg>'
  )}`;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return 'Non spécifiée';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  return (
    <div className="details-film-container">
      <div className="details-header">
        <button onClick={handleBack} className="back-button">
          ← Retour
        </button>
      </div>

      <div className="movie-details-card">
        <div className="movie-poster-section">
          <img 
            src={movieDetails.poster_path ? `${IMAGE_BASE_URL}${movieDetails.poster_path}` : defaultImage}
            alt={movieDetails.title}
            className="movie-poster"
          />
          {movieDetails.isCustom && (
            <div className="custom-movie-indicator">
              <span className="custom-badge-large">Film personnalisé</span>
            </div>
          )}
        </div>
        
        <div className="movie-info-section">
          <div className="movie-header">
            <h1 className="movie-title">{movieDetails.title}</h1>
            {movieDetails.tagline && (
              <p className="movie-tagline">"{movieDetails.tagline}"</p>
            )}
          </div>
          
          <div className="movie-stats">
            <div className="stat-item">
              <span className="stat-label">Date de sortie:</span>
              <span className="stat-value">{movieDetails.release_date || 'Non spécifiée'}</span>
            </div>
            
            <div className="stat-item">
              <span className="stat-label">Note:</span>
              <div className="rating-container">
                <span className="rating-star">⭐</span>
                <span className="rating-value">{movieDetails.vote_average?.toFixed(1) || '0.0'}/10</span>
                <span className="rating-count">({movieDetails.vote_count || 0} votes)</span>
              </div>
            </div>
            
            {movieDetails.runtime && (
              <div className="stat-item">
                <span className="stat-label">Durée:</span>
                <span className="stat-value">{formatRuntime(movieDetails.runtime)}</span>
              </div>
            )}
            
            {movieDetails.budget && movieDetails.budget > 0 && (
              <div className="stat-item">
                <span className="stat-label">Budget:</span>
                <span className="stat-value">{formatCurrency(movieDetails.budget)}</span>
              </div>
            )}

            {movieDetails.revenue && movieDetails.revenue > 0 && (
              <div className="stat-item">
                <span className="stat-label">Recettes:</span>
                <span className="stat-value">{formatCurrency(movieDetails.revenue)}</span>
              </div>
            )}

            {movieDetails.status && (
              <div className="stat-item">
                <span className="stat-label">Statut:</span>
                <span className="stat-value">{movieDetails.status}</span>
              </div>
            )}
          </div>

          {movieDetails.genres && movieDetails.genres.length > 0 && (
            <div className="genres-section">
              <span className="section-label">Genres:</span>
              <div className="genres-container">
                {movieDetails.genres.map(genre => (
                  <span key={genre.id} className="genre-tag">
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="synopsis-section">
            <span className="section-label">Synopsis:</span>
            <p className="synopsis-text">
              {movieDetails.overview || 'Aucun synopsis disponible.'}
            </p>
          </div>

          {movieDetails.production_companies && movieDetails.production_companies.length > 0 && (
            <div className="production-section">
              <span className="section-label">Sociétés de production:</span>
              <div className="production-companies">
                {movieDetails.production_companies.map((company, index) => (
                  <span key={company.id} className="production-company">
                    {company.name}
                    {index < movieDetails.production_companies.length - 1 && ', '}
                  </span>
                ))}
              </div>
            </div>
          )}

          {movieDetails.production_countries && movieDetails.production_countries.length > 0 && (
            <div className="countries-section">
              <span className="section-label">Pays de production:</span>
              <div className="countries-list">
                {movieDetails.production_countries.map((country, index) => (
                  <span key={country.iso_3166_1} className="country">
                    {country.name}
                    {index < movieDetails.production_countries.length - 1 && ', '}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailsFilm;