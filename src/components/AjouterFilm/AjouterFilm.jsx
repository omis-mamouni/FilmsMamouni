import React, { useState } from 'react';
import './AjouterFilm.css';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  addCustomMovie,
  deleteCustomMovie,
  existsCustomMovieTitle
} from '../../services/customMoviesService';

const AjouterFilm = ({ addedMovies, setAddedMovies }) => {
  const [previewSrc, setPreviewSrc] = useState('');
  const [message, setMessage] = useState('');
  const queryClient = useQueryClient();

  // 🎯 Hook de formulaire React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: '',
      overview: '',
      release_date: '',
      poster_path: '',
      imageFile: null
    }
  });

  // 📌 Mutation pour l’ajout de film
  const mutation = useMutation({
    mutationFn: (newMovie) => {
      addCustomMovie(newMovie);
      return newMovie;
    },
    onSuccess: (data) => {
      setAddedMovies([data, ...addedMovies]);
      queryClient.invalidateQueries(['search']);
      setMessage('Film ajouté avec succès !');
      setTimeout(() => setMessage(''), 5000);
    }
  });

  // 📷 Gestion du fichier image uploadé
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue('poster_path', reader.result);
        setValue('imageFile', file);
        setPreviewSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ Soumission du formulaire
  const onSubmit = (data) => {
    const titre = data.title.trim();
    const description = data.overview.trim();

    if (existsCustomMovieTitle(titre)) {
      setMessage('⚠️ Un film avec ce titre existe déjà');
      return;
    }

    const nouveauFilm = {
      id: Date.now(),
      title: titre,
      overview: description,
      release_date: data.release_date,
      poster_path: data.poster_path,
      vote_average: 0,
      isCustom: true,
      created_at: new Date().toISOString()
    };

    mutation.mutate(nouveauFilm);
    reset();
    setPreviewSrc('');
  };

  const handleDeleteMovie = (movieId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce film ?')) {
      const updatedMovies = addedMovies.filter(m => m.id !== movieId);
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

      <form className="form-container" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-card">
          <div className="form-fields">

            {/* 🎬 Titre */}
            <div className="field-group">
              <label className="field-label">Titre du film *</label>
              <input
                type="text"
                {...register('title', { required: 'Le titre est obligatoire', minLength: { value: 2, message: 'Minimum 2 caractères' } })}
                className={`field-input ${errors.title ? 'field-input-error' : ''}`}
                placeholder="Entrez le titre du film"
                maxLength={100}
              />
              <div className="character-count">{watch('title')?.length || 0}/100</div>
              {errors.title && <span className="field-error">{errors.title.message}</span>}
            </div>

            {/* 📝 Description */}
            <div className="field-group">
              <label className="field-label">Description *</label>
              <textarea
                rows={4}
                {...register('overview', { required: 'La description est obligatoire', minLength: { value: 10, message: 'Minimum 10 caractères' } })}
                className={`field-textarea ${errors.overview ? 'field-input-error' : ''}`}
                placeholder="Entrez la description du film"
                maxLength={500}
              />
              <div className="character-count">{watch('overview')?.length || 0}/500</div>
              {errors.overview && <span className="field-error">{errors.overview.message}</span>}
            </div>

            {/* 📅 Date de sortie */}
            <div className="field-group">
              <label className="field-label">Date de sortie</label>
              <input
                type="date"
                {...register('release_date')}
                className="field-input"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* 🔗 Lien de l’affiche */}
            <div className="field-group">
              <label className="field-label">Lien de l'affiche (optionnel)</label>
              <input
                type="text"
                {...register('poster_path')}
                className="field-input"
                placeholder="URL ou image base64"
                onChange={(e) => {
                  setValue('poster_path', e.target.value);
                  setPreviewSrc(e.target.value);
                }}
              />
              <div className="character-count">{watch('poster_path')?.length || 0}/100</div>
            </div>

            {/* 📁 Upload image */}
            <div className="field-group">
              <label className="field-label">Ou importer une image depuis votre appareil</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="field-input"
              />
            </div>

            {/* 🖼️ Aperçu */}
            {previewSrc && (
              <div className="image-preview-box">
                <img src={previewSrc} alt="Aperçu" className="image-preview-styled" />
              </div>
            )}

            <button type="submit" className="submit-button" disabled={mutation.isLoading}>
              Ajouter le Film
            </button>
          </div>
          {message && <div className="success-message"><span className="success-icon">✅</span>{message}</div>}
        </div>
      </form>

      {/* 🎞️ Liste des films personnalisés */}
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
                    <img src={movie.poster_path} alt="Aperçu" />
                  ) : (
                    <span className="custom-movie-icon">🎬</span>
                  )}
                </div>
                <div className="custom-movie-content">
                  <h3 className="custom-movie-title">{movie.title}</h3>
                  <p className="custom-movie-date">Date: {movie.release_date || 'Non spécifiée'}</p>
                  <p className="custom-movie-overview">{movie.overview}</p>
                  <button onClick={() => handleDeleteMovie(movie.id)} className="delete-button">🗑️ Supprimer</button>
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
