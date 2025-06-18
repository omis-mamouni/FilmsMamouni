// DetailsFilm.jsx 
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './DetailsFilm.css';
import { API_KEY } from '../../config/api-config';
import { useQuery } from '@tanstack/react-query';

const MOVIE_DETAILS_URL = (id) => `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`;
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const fetchMovieDetails = async (id) => {
  const stored = sessionStorage.getItem('selectedMovie');
  if (stored) {
    const movie = JSON.parse(stored);
    if (movie.isCustom) return movie;
    const res = await fetch(MOVIE_DETAILS_URL(id));
    if (!res.ok) throw new Error('Film non trouvé');
    return res.json();
  }
  const res = await fetch(MOVIE_DETAILS_URL(id));
  if (!res.ok) throw new Error('Film non trouvé');
  return res.json();
};

const DetailsFilm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: movie, isLoading, isError, error } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => fetchMovieDetails(id),
    enabled: !!id,
  });

  const getPoster = () => {
    if (movie?.isCustom && movie.poster_path) return movie.poster_path;
    if (movie?.poster_path) return `${IMAGE_BASE_URL}${movie.poster_path}`;
    return `data:image/svg+xml,${encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600"><rect width="400" height="600" fill="#f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="50" fill="#9ca3af">🎬</text></svg>'
    )}`;
  };

  const format = (value, unit) => value ? `${value}${unit}` : 'Non spécifiée';

  if (isLoading) return <div className="film-loader">Chargement...</div>;
  if (isError || !movie) return <div className="film-error">Erreur : {error?.message || 'Introuvable'}</div>;

  return (
    <div className="film-details-wrapper">
      <button onClick={() => navigate(-1)} className="btn-back">← Retour</button>

      <div className="film-card">
        <div className="film-poster">
          <img src={getPoster()} alt={movie.title} />
        </div>

        <div className="film-info">
          <h1 className="film-title">{movie.title}</h1>
          {movie.tagline && <p className="film-tagline">"{movie.tagline}"</p>}

          <div className="film-meta">
            <span><strong>📅 Sortie :</strong> {movie.release_date || 'Non spécifiée'}</span>
            <span><strong>⭐ Note :</strong> {movie.vote_average?.toFixed(1) || '0.0'} /10 ({movie.vote_count} votes)</span>
            <span><strong>⏱ Durée :</strong> {format(movie.runtime, ' min')}</span>
            <span><strong>💰 Budget :</strong> {movie.budget ? movie.budget.toLocaleString('fr-FR', { style: 'currency', currency: 'USD' }) : 'Non spécifié'}</span>
            <span><strong>💵 Recettes :</strong> {movie.revenue ? movie.revenue.toLocaleString('fr-FR', { style: 'currency', currency: 'USD' }) : 'Non spécifiées'}</span>
          </div>

          <div className="film-section">
            <h3>🎞 Genres</h3>
            <div className="tags">
              {movie.genres?.map(g => <span key={g.id} className="tag">{g.name}</span>)}
            </div>
          </div>

          <div className="film-section">
            <h3>📖 Synopsis</h3>
            <p>{movie.overview || 'Aucun synopsis disponible.'}</p>
          </div>

          {movie.production_companies?.length > 0 && (
            <div className="film-section">
              <h3>🏢 Production</h3>
              <p>{movie.production_companies.map(p => p.name).join(', ')}</p>
            </div>
          )}

          {movie.production_countries?.length > 0 && (
            <div className="film-section">
              <h3>🌍 Pays</h3>
              <p>{movie.production_countries.map(c => c.name).join(', ')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailsFilm;
