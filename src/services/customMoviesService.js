const STORAGE_KEY = 'customMovies';

export const getCustomMovies = () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
};

export const addCustomMovie = (movie) => {
    const movies = getCustomMovies();
    movies.push(movie);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
};

export const deleteCustomMovie = (id) => {
    const movies = getCustomMovies().filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
};

export const existsCustomMovieTitle = (title) => {
    return getCustomMovies().some(m => m.title.toLowerCase() === title.toLowerCase());
};