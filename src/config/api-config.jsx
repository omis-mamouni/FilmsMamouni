// api-config.jsx
export const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
export const BASE_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}`
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'
export const searchBar = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}`

// URLs supplémentaires utiles
export const MOVIE_DETAILS_URL = (movieId) => 
  `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`

export const POPULAR_MOVIES_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`

export const TOP_RATED_MOVIES_URL = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}`