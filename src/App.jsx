// App.jsx
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import Accueil from './components/Accueil/Accueil';
import Recherche from './components/Recherche/Recherche';
import AjouterFilm from './components/AjouterFilm/AjouterFilm';
import DetailsFilm from './components/DetailsFilm/DetailsFilm';
import './App.css';

const App = () => {
  const [addedMovies, setAddedMovies] = useState([]);

  return (
    <div className="app">
      <Navigation />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/accueil" element={<Accueil />} />
          <Route path="/recherche" element={<Recherche />} />
          <Route  path="/ajouter" 
            element={
              <AjouterFilm 
                addedMovies={addedMovies} 
                setAddedMovies={setAddedMovies} 
              />
            } 
          />
          <Route path="/details/:id" element={<DetailsFilm />} />
        </Routes>
      </main>

    </div>
  );
};

export default App;