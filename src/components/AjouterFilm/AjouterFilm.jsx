import React, { useState } from 'react';
import './AjouterFilm.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  addCustomMovie,
  getCustomMovies,
  deleteCustomMovie,
  existsCustomMovieTitle
} from '../../services/customMoviesService';

const AjouterFilm = ({ addedMovies, setAddedMovies }) => {
  const [formData, setFormData] = useState({
    title: '',
    overview: '',
    release_date: '',
    poster_path: '',
    imageFile: null
  });
  const [previewSrc, setPreviewSrc] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const queryClient = useQueryClient();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Le titre est obligatoire';
    else if (formData.title.trim().length < 2) newErrors.title = 'Le titre doit contenir au moins 2 caractères';
    if (!formData.overview.trim()) newErrors.overview = 'La description est obligatoire';
    else if (formData.overview.trim().length < 10) newErrors.overview = 'La description doit contenir au moins 10 caractères';
    return newErrors;
  };

  const mutation = useMutation({
    mutationFn: (newMovie) => {
      addCustomMovie(newMovie);
      return newMovie;
    },
    onSuccess: (data) => {
      setAddedMovies([data, ...addedMovies]);
      queryClient.invalidateQueries(['search']);
      setMessage('✅ Film ajouté avec succès !');
      setTimeout(() => setMessage(''), 5000);
    }
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'imageFile' && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, poster_path: reader.result, imageFile: file }));
        setPreviewSrc(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (name === 'poster_path') {
        setPreviewSrc(value);
      }
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setMessage('');
      return;
    }
    if (existsCustomMovieTitle(formData.title.trim())) {
      setErrors({ title: 'Un film avec ce titre existe déjà' });
      setMessage('');
      return;
    }
    const newMovie = {
      id: Date.now(),
      title: formData.title.trim(),
      overview: formData.overview.trim(),
      release_date: formData.release_date,
      poster_path: formData.poster_path,
      vote_average: 0,
      isCustom: true,
      created_at: new Date().toISOString()
    };
    mutation.mutate(newMovie);
    setFormData({ title: '', overview: '', release_date: '', poster_path: '', imageFile: null });
    setPreviewSrc('');
    setErrors({});
  };

  const handleDeleteMovie = (movieId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce film ?')) {
      const updatedMovies = addedMovies.filter(movie => movie.id !== movieId);
      setAddedMovies(updatedMovies);
      deleteCustomMovie(movieId);
      queryClient.invalidateQueries(['search']);
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
              <label className="field-label">Titre du film *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} className={`field-input ${errors.title ? 'field-input-error' : ''}`} placeholder="Entrez le titre du film" maxLength={100} />
              <div className="character-count">{formData.title.length}/100</div>
              {errors.title && <span className="field-error">{errors.title}</span>}
            </div>
            <div className="field-group">
              <label className="field-label">Description *</label>
              <textarea name="overview" value={formData.overview} onChange={handleChange} rows={4} className={`field-textarea ${errors.overview ? 'field-input-error' : ''}`} placeholder="Entrez la description du film" maxLength={500} />
              <div className="character-count">{formData.overview.length}/500</div>
              {errors.overview && <span className="field-error">{errors.overview}</span>}
            </div>
            <div className="field-group">
              <label className="field-label">Date de sortie</label>
              <input type="date" name="release_date" value={formData.release_date} onChange={handleChange} className="field-input" max={new Date().toISOString().split('T')[0]} />
            </div>
            <div className="field-group">
              <label className="field-label">Lien de l'affiche (optionnel)</label>
              <input type="text" name="poster_path" value={formData.poster_path} onChange={handleChange} className="field-input" placeholder="URL ou image base64" />
              <div className="character-count">{formData.poster_path.length}/100</div>
            </div>
            <div className="field-group">
              <label className="field-label">Ou importer une image depuis votre appareil</label>
              <input type="file" accept="image/*" name="imageFile" onChange={handleChange} className="field-input" />
            </div>
            {previewSrc && (
              <div className="image-preview-box">
                <img src={previewSrc} alt="Aperçu" className="image-preview-styled" />
              </div>
            )}
            <button onClick={handleSubmit} className="submit-button" disabled={mutation.isLoading}>➕ Ajouter le Film</button>
          </div>
          {message && <div className="success-message"><span className="success-icon">✅</span>{message}</div>}
        </div>
      </div>

      {addedMovies.length > 0 && (
        <div className="added-movies-section">
          <div className="added-movies-header">
            <h2 className="added-movies-title">Mes Films Ajoutés ({addedMovies.length})</h2>
          </div>
          <div className="added-movies-grid">
            {addedMovies.map(movie => (
              <div key={movie.id} className="custom-movie-card">
                <div className="custom-movie-image">
                  {movie.poster_path ? (
                    <img src={movie.poster_path} alt="Aperçu" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span className="custom-movie-icon">🎬</span>
                  )}
                </div>
                <div className="custom-movie-content">
                  <h3 className="custom-movie-title">{movie.title}</h3>
                  <p className="custom-movie-date">Date: {movie.release_date || 'Non spécifiée'}</p>
                  <p className="custom-movie-overview">{movie.overview}</p>
                  
                  <button onClick={() => handleDeleteMovie(movie.id)} className="delete-button" title="Supprimer ce film">🗑️ Supprimer</button>
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
