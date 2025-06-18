//  CarteFilm.jsx

import './CarteFilm.css';
import { IMAGE_BASE_URL } from '../../config/api-config';
import { deleteCustomMovie } from '../../services/customMoviesService';
import { useState } from 'react';

const CarteFilm = ({ movie, onClick, refreshCustom }) => {
  const isCustom = movie.isCustom;
  const [deleted, setDeleted] = useState(false);

  const getImage = () => {
    if (isCustom && movie.poster_path) return movie.poster_path;
    if (movie.poster_path) return `${IMAGE_BASE_URL}${movie.poster_path}`;
    return `data:image/svg+xml,${encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450"><rect width="300" height="450" fill="#e5e7eb"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="40" fill="#9ca3af">🎬</text></svg>'
    )}`;
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Supprimer ce film ?')) {
      deleteCustomMovie(movie.id);
      setDeleted(true);
      if (refreshCustom) refreshCustom();
    }
  };

  if (deleted) return null;

  return (
    <div className="movie-card" onClick={() => onClick && onClick(movie)}>
      <img src={getImage()} alt={movie.title} />

      <div className="badge-note">⭐ {movie.vote_average?.toFixed(1) || '0.0'}</div>

      <div className="movie-title-hover">{movie.title}</div>

      {isCustom && (
        <div className="movie-card-badge">
          <span className="custom-badge">Film personnalisé</span>
          <button className="delete-button" onClick={handleDelete}>🗑️</button>
        </div>
      )}
    </div>
  );
};

export default CarteFilm;
