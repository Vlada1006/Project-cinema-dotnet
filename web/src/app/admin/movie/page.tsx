"use client";

import React, { useState, useEffect } from "react";

interface Genre {
  id: number;
  name: string;
}

interface Director {
  id: number;
  name: string;
}

interface Movie {
  id: number;
  title: string;
  description: string;
  releaseDate: string;
  rating: number;
  duration: number;
  language: string;
  posterUrl: string;
  trailerUrl: string;
  genres: Genre[];
  directors: Director[];
}

const MoviesPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [newMovie, setNewMovie] = useState<Movie>({
    id: 0,
    title: "",
    description: "",
    releaseDate: "",
    rating: 0,
    duration: 0,
    language: "",
    posterUrl: "",
    trailerUrl: "",
    genres: [],
    directors: [],
  });

  const languages = ["English", "Ukrainian", "Spanish", "French", "German"]; // Available languages

  // Fetch the list of movies
  useEffect(() => {
    fetch("/api/movies")
      .then((response) => response.json())
      .then((data) => setMovies(data))
      .catch((error) => console.error("Error fetching movies:", error));
  }, []);

  // Add a new movie
  const addMovie = () => {
    if (newMovie.title.trim()) {
      fetch("/api/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMovie),
      })
        .then((response) => response.json())
        .then((data) => setMovies([...movies, data]))
        .catch((error) => console.error("Error adding movie:", error));

      setNewMovie({
        id: 0,
        title: "",
        description: "",
        releaseDate: "",
        rating: 0,
        duration: 0,
        language: "",
        posterUrl: "",
        trailerUrl: "",
        genres: [],
        directors: [],
      });
    }
  };

  // Delete a movie
  const removeMovie = (id: number) => {
    fetch(`/api/movies/${id}`, { method: "DELETE" })
      .then(() => setMovies(movies.filter((movie) => movie.id !== id)))
      .catch((error) => console.error("Error deleting movie:", error));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto bg-gray-800 rounded-lg p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-yellow-600 mb-4">Керування фільмами</h1>

        {/* List of movies */}
        <ul className="space-y-4 mb-8">
          {movies.map((movie) => (
            <li
              key={movie.id}
              className="flex items-center justify-between bg-gray-700 p-4 rounded-lg"
            >
              <div>
                <h2 className="text-xl font-semibold text-yellow-500">{movie.title}</h2>
                <p className="text-sm text-gray-300">{movie.description}</p>
              </div>
              <button
                onClick={() => removeMovie(movie.id)}
                className="bg-red-600 px-4 py-2 text-white rounded hover:bg-red-500"
              >
                Видалити
              </button>
            </li>
          ))}
        </ul>

        {/* Form to add a new movie */}
        <div className="bg-gray-700 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-yellow-600 mb-4">Додати новий фільм</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block text-yellow-500 mb-2 text-sm">Назва фільму</label>
              <input
                id="title"
                type="text"
                className="w-full p-3 bg-gray-800 text-white rounded"
                value={newMovie.title}
                onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-yellow-500 mb-2 text-sm">Опис фільму</label>
              <textarea
                id="description"
                className="w-full p-3 bg-gray-800 text-white rounded"
                value={newMovie.description}
                onChange={(e) => setNewMovie({ ...newMovie, description: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="releaseDate" className="block text-yellow-500 mb-2 text-sm">Дата виходу</label>
              <input
                id="releaseDate"
                type="date"
                className="w-full p-3 bg-gray-800 text-white rounded"
                value={newMovie.releaseDate}
                onChange={(e) => setNewMovie({ ...newMovie, releaseDate: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="rating" className="block text-yellow-500 mb-2 text-sm">Рейтинг</label>
              <input
                id="rating"
                type="number"
                className="w-full p-3 bg-gray-800 text-white rounded"
                min="0"
                max="5"
                value={newMovie.rating}
                onChange={(e) => setNewMovie({ ...newMovie, rating: parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <label htmlFor="duration" className="block text-yellow-500 mb-2 text-sm">Тривалість (хв)</label>
              <input
                id="duration"
                type="number"
                className="w-full p-3 bg-gray-800 text-white rounded"
                value={newMovie.duration}
                onChange={(e) => setNewMovie({ ...newMovie, duration: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label htmlFor="language" className="block text-yellow-500 mb-2 text-sm">Мова</label>
              <select
                id="language"
                className="w-full p-3 bg-gray-800 text-white rounded"
                value={newMovie.language}
                onChange={(e) => setNewMovie({ ...newMovie, language: e.target.value })}
              >
                <option value="">Оберіть мову</option>
                {languages.map((language, index) => (
                  <option key={index} value={language}>{language}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="posterUrl" className="block text-yellow-500 mb-2 text-sm">URL постера</label>
              <input
                id="posterUrl"
                type="text"
                className="w-full p-3 bg-gray-800 text-white rounded"
                value={newMovie.posterUrl}
                onChange={(e) => setNewMovie({ ...newMovie, posterUrl: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="trailerUrl" className="block text-yellow-500 mb-2 text-sm">URL трейлера</label>
              <input
                id="trailerUrl"
                type="text"
                className="w-full p-3 bg-gray-800 text-white rounded"
                value={newMovie.trailerUrl}
                onChange={(e) => setNewMovie({ ...newMovie, trailerUrl: e.target.value })}
              />
            </div>
          </div>
          <button
            onClick={addMovie}
            className="mt-4 w-full bg-yellow-600 text-black p-3 rounded hover:bg-yellow-500"
          >
            Додати фільм
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoviesPage;
