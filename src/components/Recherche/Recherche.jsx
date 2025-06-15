// Recherche.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Recherche.css';
import { searchBar } from '../../config/api-config';
import MovieCard from '../MovieCard/MovieCard';

const Recherche = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setError('Veuillez entrer un terme de recherche');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setHasSearched(true);
      
      const response = await fetch(`${searchBar}&query=${encodeURIComponent(searchQuery.trim())}`);
      if (!response.ok) throw new Error('Erreur lors de la recherche');
      
      const data = await response.json();
      setMovies(data.results || []);
    } catch (err) {
      setError('Erreur lors de la recherche. Vérifiez votre connexion internet.');
      console.error('Erreur de recherche:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = (movie) => {
    // Stocker les données du film dans le sessionStorage
    sessionStorage.setItem('selectedMovie', JSON.stringify(movie));
    navigate(`/details/${movie.id}`);
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    if (error) setError('');
  };

  return (
    <div className="recherche-container">
      <header className="recherche-header">
        <h1 className="recherche-title">Recherche de Films</h1>
        <p className="recherche-subtitle">Trouvez vos films préférés</p>
      </header>

      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-container">
            <input
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              placeholder="Entrez le nom d'un film..."
              className={`search-input ${error ? 'search-input-error' : ''}`}
              maxLength={100}
            />
            <button 
              type="submit" 
              disabled={loading}
              className="search-button"
            >
              {loading ? (
                <span className="search-loading">🔄</span>
              ) : (
                '🔍 Rechercher'
              )}
            </button>
          </div>
          {error && <p className="search-error">{error}</p>}
        </form>
      </div>

      <div className="results-section">
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Recherche en cours...</p>
          </div>
        )}

        {!loading && hasSearched && movies.length === 0 && !error && (
          <div className="no-results">
            <span className="no-results-icon">🎬</span>
            <h3>Aucun film trouvé</h3>
            <p>Essayez avec d'autres mots-clés</p>
          </div>
        )}

        {!loading && movies.length > 0 && (
          <>
            <div className="results-header">
              <h2 className="results-title">
                Résultats de recherche ({movies.length})
              </h2>
              <p className="results-subtitle">
                Recherche pour: "<strong>{searchQuery}</strong>"
              </p>
            </div>
            
            <div className="movies-grid">
              {movies.map(movie => (
                <MovieCard 
                  key={movie.id} 
                  movie={movie} 
                  onClick={handleMovieClick}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Recherche;