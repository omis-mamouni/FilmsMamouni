import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navigation.css';
import { useState } from 'react';

const Navigation = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      sessionStorage.setItem('searchQuery', query.trim());
      navigate('/recherche');
      setQuery('');
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <h1 className="navbar-logo">MSID <span className="logo-highlight">FILMS</span></h1>
        </div>

        <form onSubmit={handleSubmit} className="navbar-search">
          <input
            type="text"
            placeholder="Rechercher un film..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M21.71 20.29l-3.39-3.39A9 9 0 1019 19l3.39 3.39a1 1 0 01-1.41 1.41zM11 18a7 7 0 117-7 7 7 0 01-7 7z"/>
  </svg>
</button>

        </form>

        <div className="navbar-right">
          <Link to="/" className="nav-link">Accueil</Link>
          <Link to="/ajouter" className="nav-link highlight">+ Ajouter</Link>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
