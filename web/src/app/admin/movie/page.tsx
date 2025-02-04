"use client";

import React, { useState, useEffect } from "react";

// Оголошення інтерфейсів для типів
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

  const languages = ["English", "Ukrainian", "Spanish", "French", "German"];

  // ✅ Fetch the list of movies with logging
  useEffect(() => {
    console.log("📦 Requesting films..."); // Лог до запиту
    fetch("https://localhost:7000/api/Films")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("📦 Response data:", data); // Лог після отримання даних
        if (data && Array.isArray(data.data)) {
          setMovies(data.data); // Якщо API повертає об'єкт з полем "data"
        } else {
          console.error("❌ Unexpected data format:", data);
        }
      })
      .catch((error) => console.error("Error fetching movies:", error));
  }, []);

  // ✅ Add a new movie with logging
  const addMovie = () => {
    if (newMovie.title.trim() && newMovie.rating >= 0 && newMovie.rating <= 5 && newMovie.duration >= 0) {
      // Перетворення дати у формат UTC
      const releaseDateUtc = new Date(newMovie.releaseDate).toISOString();

      const movieWithUtcDate = {
        ...newMovie,
        releaseDate: releaseDateUtc, // Використовуємо UTC формат дати
      };

      fetch("https://localhost:7000/api/Films", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movieWithUtcDate),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to add movie");
          }
          return response.json();
        })
        .then(() => {
          console.log("✅ Movie added successfully");
          // Повторний запит для оновлення списку фільмів
          return fetch("https://localhost:7000/api/Films");
        })
        .then((response) => response.json())
        .then((data) => {
          if (data && Array.isArray(data.data)) {
            setMovies(data.data); // Оновлення списку фільмів
          }
        })
        .catch((error) => console.error("Error adding movie:", error));

      // Очищення форми після додавання
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

  // ✅ Delete a movie with logging
  const removeMovie = (id: number) => {
    fetch(`https://localhost:7000/api/Films/${id}`, { method: "DELETE" })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to delete movie with ID ${id}`);
        }
        console.log(`🗑️ Movie with ID ${id} deleted`);
        setMovies(movies.filter((movie) => movie.id !== id));
      })
      .catch((error) => console.error("Error deleting movie:", error));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto bg-gray-800 rounded-lg p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-yellow-600 mb-4">Керування фільмами</h1>

        {/* ✅ List of movies */}
        <ul className="space-y-4 mb-8">
          {Array.isArray(movies) && movies.length > 0 ? (
            movies.map((movie) => (
              <li key={movie.id} className="flex items-center justify-between bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center space-x-4">
                  {/* Постер фільму */}
                  {movie.posterUrl && (
                    <img
                      src={movie.posterUrl}
                      alt={`Poster of ${movie.title}`}
                      className="w-32 h-48 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <h2 className="text-xl font-semibold text-yellow-500">{movie.title}</h2>
                    <p className="text-sm text-gray-300">{movie.description}</p>
                    <p className="text-sm text-gray-400">Рейтинг: {movie.rating}/5</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {/* Кнопка для перегляду трейлера */}
                  {movie.trailerUrl && (
                    <a
                      href={movie.trailerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 px-4 py-2 text-white rounded hover:bg-blue-500"
                    >
                      Переглянути трейлер
                    </a>
                  )}
                  {/* Кнопка для видалення */}
                  <button
                    onClick={() => removeMovie(movie.id)}
                    className="bg-red-600 px-4 py-2 text-white rounded hover:bg-red-500"
                  >
                    Видалити
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-400">Немає фільмів для відображення.</p>
          )}
        </ul>

        {/* ✅ Form to add a new movie */}
        <div className="bg-gray-700 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-yellow-600 mb-4">Додати новий фільм</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-yellow-500 mb-2 text-sm">Назва фільму</label>
              <input
                type="text"
                className="w-full p-3 bg-gray-800 text-white rounded"
                value={newMovie.title}
                onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
                maxLength={255}
              />
            </div>
            <div>
              <label className="block text-yellow-500 mb-2 text-sm">Опис фільму</label>
              <textarea
                className="w-full p-3 bg-gray-800 text-white rounded"
                value={newMovie.description}
                onChange={(e) => setNewMovie({ ...newMovie, description: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-yellow-500 mb-2 text-sm">Дата виходу</label>
              <input
                type="date"
                className="w-full p-3 bg-gray-800 text-white rounded"
                value={newMovie.releaseDate}
                onChange={(e) => setNewMovie({ ...newMovie, releaseDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-yellow-500 mb-2 text-sm">Рейтинг (0-5)</label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.01"
                className="w-full p-3 bg-gray-800 text-white rounded"
                value={newMovie.rating}
                onChange={(e) => setNewMovie({ ...newMovie, rating: parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-yellow-500 mb-2 text-sm">Тривалість (хв)</label>
              <input
                type="number"
                min="0"
                className="w-full p-3 bg-gray-800 text-white rounded"
                value={newMovie.duration}
                onChange={(e) => setNewMovie({ ...newMovie, duration: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-yellow-500 mb-2 text-sm">Мова</label>
              <select
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
              <label className="block text-yellow-500 mb-2 text-sm">Poster URL</label>
              <input
                type="url"
                className="w-full p-3 bg-gray-800 text-white rounded"
                placeholder="Введіть URL постера"
                value={newMovie.posterUrl}
                onChange={(e) => setNewMovie({ ...newMovie, posterUrl: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-yellow-500 mb-2 text-sm">Trailer URL</label>
              <input
                type="url"
                className="w-full p-3 bg-gray-800 text-white rounded"
                placeholder="Введіть URL трейлера"
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
