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

  const [formError, setFormError] = useState<string | null>(null); // для помилки форми

  const languages = ["English", "Ukrainian", "Spanish", "French", "German"];

  useEffect(() => {
    fetch("https://localhost:7000/api/Films")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data && Array.isArray(data.data)) {
          setMovies(data.data);
        }
      })
      .catch((error) => console.error("Error fetching movies:", error));
  }, []);

  const addMovie = () => {
    if (
      !newMovie.title.trim() ||
      !newMovie.description.trim() ||
      !newMovie.releaseDate ||
      newMovie.rating < 0 ||
      newMovie.rating > 5 ||
      newMovie.duration <= 0 ||
      !newMovie.language ||
      !newMovie.posterUrl ||
      !newMovie.trailerUrl
    ) {
      setFormError("Всі поля, позначені зірочкою, обов'язкові для заповнення.");
      return;
    }

    const releaseDateUtc = new Date(newMovie.releaseDate).toISOString();
    const movieWithUtcDate = {
      ...newMovie,
      releaseDate: releaseDateUtc,
    };

    fetch("https://localhost:7000/api/Films", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(movieWithUtcDate),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Failed to add movie: ${response.status}`);
        }
        const responseData = await response.json();
        console.log("Movie added response:", responseData); // Додаємо логування
        return fetch("https://localhost:7000/api/Films");
      })
      .then((response) => response.json())
      .then((data) => {
        console.log("Updated movie list:", data); // Логування для перевірки отриманих даних
        if (data && Array.isArray(data.data)) {
          setMovies(data.data);
        }
      })
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
    setFormError(null);
  };

  const removeMovie = (id: number) => {
    fetch(`https://localhost:7000/api/Films/${id}`, { method: "DELETE" })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to delete movie with ID ${id}`);
        }
        setMovies(movies.filter((movie) => movie.id !== id));
      })
      .catch((error) => console.error("Error deleting movie:", error));
  };

  const truncateDescription = (description: string, maxLength: number = 150) => {
    if (description.length > maxLength) {
      return `${description.slice(0, maxLength)}...`;
    }
    return description;
  };

  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});

  const toggleDescription = (id: number) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="bg-gray-700 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-bold text-yellow-600 mb-4">Додати новий фільм</h2>
          {formError && <p className="text-red-600 mb-4">{formError}</p>} 
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-yellow-500 mb-2 text-sm">
                Назва фільму <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                className="w-full p-3 bg-gray-800 text-white rounded"
                value={newMovie.title}
                onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
                maxLength={255}
              />
            </div>
            <div>
              <label className="block text-yellow-500 mb-2 text-sm">
                Опис фільму <span className="text-red-600">*</span>
              </label>
              <textarea
                className="w-full p-3 bg-gray-800 text-white rounded"
                value={newMovie.description}
                onChange={(e) => setNewMovie({ ...newMovie, description: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-yellow-500 mb-2 text-sm">
                Дата виходу <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                className="w-full p-3 bg-gray-800 text-white rounded"
                value={newMovie.releaseDate}
                onChange={(e) => setNewMovie({ ...newMovie, releaseDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-yellow-500 mb-2 text-sm">
                Рейтинг (0-5) <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                className="w-full p-3 bg-gray-800 text-white rounded"
                value={newMovie.rating}
                onChange={(e) => setNewMovie({ ...newMovie, rating: parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-yellow-500 mb-2 text-sm">
                Тривалість (хв) <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="10"
                className="w-full p-3 bg-gray-800 text-white rounded"
                value={newMovie.duration}
                onChange={(e) => setNewMovie({ ...newMovie, duration: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-yellow-500 mb-2 text-sm">
                Мова <span className="text-red-600">*</span>
              </label>
              <select
                className="w-full p-3 bg-gray-800 text-white rounded"
                value={newMovie.language}
                onChange={(e) => setNewMovie({ ...newMovie, language: e.target.value })}
              >
                <option value="">Оберіть мову</option>
                {languages.map((language, index) => (
                  <option key={index} value={language}>
                    {language}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-yellow-500 mb-2 text-sm">
                Постер URL <span className="text-red-600">*</span>
              </label>
              <input
                type="url"
                className="w-full p-3 bg-gray-800 text-white rounded"
                placeholder="https://example.com"
                value={newMovie.posterUrl}
                onChange={(e) => setNewMovie({ ...newMovie, posterUrl: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-yellow-500 mb-2 text-sm">
                Трейлер URL <span className="text-red-600">*</span>
              </label>
              <input
                type="url"
                className="w-full p-3 bg-gray-800 text-white rounded"
                placeholder="https://example.com"
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

        <h1 className="text-2xl font-bold text-yellow-600 mb-4">Керування фільмами</h1>
        <ul className="space-y-4 mb-8">
          {Array.isArray(movies) && movies.length > 0 ? (
            movies.map((movie) => (
              <li
                key={movie.id}
                className="flex items-center justify-between bg-gray-700 p-4 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  {movie.posterUrl && (
                    <img
                      src={movie.posterUrl}
                      alt={`Poster of ${movie.title}`}
                      className="w-32 h-48 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <h2 className="text-xl font-semibold text-yellow-500">{movie.title}</h2>
                    <p className="text-sm text-gray-300">
                      {expanded[movie.id]
                        ? movie.description
                        : truncateDescription(movie.description)}
                      <span
                        onClick={() => toggleDescription(movie.id)}
                        className="text-yellow-500 cursor-pointer ml-2"
                      >
                        {expanded[movie.id] ? "Сховати" : "Більше"}
                      </span>
                    </p>
                    <p className="text-sm text-gray-400">Рейтинг: {movie.rating}/5</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
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
      </div>
    </div>
  );
};

export default MoviesPage;
