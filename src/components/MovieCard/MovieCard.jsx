// MovieCard.js
import React from 'react';
import './MovieCard.css';

import { IMAGE_BASE_URL } from '../../config/api-config';

const MovieCard = ({ movie, onClick }) => {
  const defaultImage = `data:image/svg+xml,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450"><rect width="300" height="450" fill="#e5e7eb"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="40" fill="#9ca3af">🎬</text></svg>'
  )}`;

  return (
    <div 
      onClick={() => onClick(movie)}
      className="movie-card"
    >
      <img 
        src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : defaultImage}
        alt={movie.title}
        className="movie-card-image"
      />
      <div className="movie-card-content">
        <h3 className="movie-card-title">{movie.title}</h3>
        <p className="movie-card-date">Date: {movie.release_date || 'Non spécifiée'}</p>
        <p className="movie-card-overview">{movie.overview}</p>
        <div className="movie-card-rating">
          <span className="rating-star">⭐</span>
          <span className="rating-value">{movie.vote_average?.toFixed(1) || 'N/A'}</span>
        </div>
        {movie.isCustom && (
          <div className="movie-card-badge">
            <span className="custom-badge">Film personnalisé</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieCard;