// AjouterFilm.jsx
import React, { useState } from 'react';
import './AjouterFilm.css';

const AjouterFilm = ({ addedMovies, setAddedMovies }) => {
  const [formData, setFormData] = useState({
    title: '',
    overview: '',
    release_date: ''
  });
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est obligatoire';
    } else if (formData.title.trim().length < 2) {
      newErrors.title = 'Le titre doit contenir au moins 2 caractères';
    }
    
    if (!formData.overview.trim()) {
      newErrors.overview = 'La description est obligatoire';
    } else if (formData.overview.trim().length < 10) {
      newErrors.overview = 'La description doit contenir au moins 10 caractères';
    }
    
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = () => {
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setMessage('');
      return;
    }

    // Check if movie with same title already exists
    const titleExists = addedMovies.some(
      movie => movie.title.toLowerCase() === formData.title.trim().toLowerCase()
    );
    
    if (titleExists) {
      setErrors({ title: 'Un film avec ce titre existe déjà' });
      setMessage('');
      return;
    }

    const newMovie = {
      id: Date.now(),
      title: formData.title.trim(),
      overview: formData.overview.trim(),
      release_date: formData.release_date,
      poster_path: null,
      vote_average: 0,
      isCustom: true,
      created_at: new Date().toISOString()
    };

    setAddedMovies([newMovie, ...addedMovies]);
    setFormData({ title: '', overview: '', release_date: '' });
    setErrors({});
    setMessage('Film ajouté avec succès !');
    
    setTimeout(() => setMessage(''), 5000);
  };

  const handleDeleteMovie = (movieId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce film ?')) {
      setAddedMovies(addedMovies.filter(movie => movie.id !== movieId));
    }
  };

  return (
    <div className="ajouter-film-container">
      <header className="ajouter-film-header">
        <h1 className="ajouter-film-title">Ajouter un Nouveau Film</h1>
        <p className="ajouter-film-subtitle">Créez votre propre collection de films</p>
      </header>
      
      <div className="form-container">
        <div className="form-card">
          <div className="form-fields">
            <div className="field-group">
              <label className="field-label">
                Titre du film *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`field-input ${errors.title ? 'field-input-error' : ''}`}
                placeholder="Entrez le titre du film"
                maxLength={100}
              />
              {errors.title && <span className="field-error">{errors.title}</span>}
            </div>

            <div className="field-group">
              <label className="field-label">
                Description *
              </label>
              <textarea
                name="overview"
                value={formData.overview}
                onChange={handleChange}
                rows={4}
                className={`field-textarea ${errors.overview ? 'field-input-error' : ''}`}
                placeholder="Entrez la description du film"
                maxLength={500}
              />
              <div className="character-count">
                {formData.overview.length}/500 caractères
              </div>
              {errors.overview && <span className="field-error">{errors.overview}</span>}
            </div>

            <div className="field-group">
              <label className="field-label">
                Date de sortie
              </label>
              <input
                type="date"
                name="release_date"
                value={formData.release_date}
                onChange={handleChange}
                className="field-input"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            <button
              onClick={handleSubmit}
              className="submit-button"
            >
              ➕ Ajouter le Film
            </button>
          </div>

          {message && (
            <div className="success-message">
              <span className="success-icon">✅</span>
              {message}
            </div>
          )}
        </div>
      </div>

      {addedMovies.length > 0 && (
        <div className="added-movies-section">
          <div className="added-movies-header">
            <h2 className="added-movies-title">
              Mes Films Ajoutés ({addedMovies.length})
            </h2>
          </div>
          
          <div className="added-movies-grid">
            {addedMovies.map(movie => (
              <div key={movie.id} className="custom-movie-card">
                <div className="custom-movie-image">
                  <span className="custom-movie-icon">🎬</span>
                </div>
                <div className="custom-movie-content">
                  <h3 className="custom-movie-title">{movie.title}</h3>
                  <p className="custom-movie-date">
                    Date: {movie.release_date || 'Non spécifiée'}
                  </p>
                  <p className="custom-movie-overview">{movie.overview}</p>
                  <div className="custom-movie-badges">
                    <span className="custom-badge">Film personnalisé</span>
                  </div>
                  <button 
                    onClick={() => handleDeleteMovie(movie.id)}
                    className="delete-button"
                    title="Supprimer ce film"
                  >
                    🗑️ Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AjouterFilm;