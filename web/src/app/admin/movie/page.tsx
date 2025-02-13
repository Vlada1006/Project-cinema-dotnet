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

  const languages = ["Англійська", "Українська", "Іспанська", "Французька", "Німецька"];

  const [allGenres, setAllGenres] = useState<Genre[]>([]);
  const [newGenre, setNewGenre] = useState<string>("");

  const [allDirectors, setAllDirectors] = useState<Director[]>([]);
  const [newDirector, setNewDirector] = useState<string>("");

  useEffect(() => {
    fetch("https://localhost:7000/api/Films")
      .then((response) => response.json())
      .then((data) => setMovies(data.data))
      .catch((error) => console.error("Error fetching movies:", error));
  
    // Fetching genres
    fetch("https://localhost:7000/api/Genres")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched genres:", data.data); // Debug log
        setAllGenres(data.data);
      })
      .catch((error) => console.error("Error fetching genres:", error));
  
    // Fetching directors
    fetch("https://localhost:7000/api/Directors")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched directors:", data.data); // Debug log
        setAllDirectors(data.data);
      })
      .catch((error) => console.error("Error fetching directors:", error));
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
      !newMovie.trailerUrl ||
      newMovie.genres.length === 0 ||
      newMovie.directors.length === 0
    ) {
      setFormError("Всі поля, позначені зірочкою, обов'язкові для заповнення.");
      return;
    }
  
    const releaseDateUtc = new Date(newMovie.releaseDate).toISOString();
    const movieWithUtcDate = {
      ...newMovie,
      releaseDate: releaseDateUtc,
      genres: newMovie.genres.map(genre => genre.id), // Передаємо тільки id жанрів
      directors: newMovie.directors.map(director => director.id), // Передаємо тільки id режисерів
    };

    console.log("Movie data to be sent:", movieWithUtcDate); // Логування даних перед відправкою

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
        console.log("Movie added response:", responseData);
        return fetch("https://localhost:7000/api/Films");
      })
      .then((response) => response.json())
      .then((data) => {
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
    setNewGenre("");
    setNewDirector("");
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

  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});

  const toggleDescription = (id: number) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const addNewGenre = () => {
    if (newGenre.trim()) {
      const genreExists = allGenres.some((genre) => genre.name.toLowerCase() === newGenre.toLowerCase());
  
      if (!genreExists) {
        const newGenreData = { name: newGenre.trim() };
  
        fetch("https://localhost:7000/api/Genres", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newGenreData),
        })
          .then(async (response) => {
            if (!response.ok) {
              throw new Error(`Failed to add genre: ${response.status}`);
            }
            const responseData = await response.json();
            console.log("Genre added response:", responseData);
        
            if (!responseData.data || !responseData.data.id) {
              throw new Error("Invalid response structure from server");
            }
        
            const addedGenre = { id: responseData.data.id, name: newGenre.trim() };
            setAllGenres((prev) => [...prev, addedGenre]);
        
            setNewMovie((prev) => ({
              ...prev,
              genres: [...prev.genres, addedGenre],
            }));
        
            setNewGenre("");
          })
          .catch((error) => console.error("Error adding genre:", error));
        
      } else {
        const existingGenre = allGenres.find((genre) => genre.name.toLowerCase() === newGenre.toLowerCase());
        if (existingGenre) {
          setNewMovie((prev) => ({
            ...prev,
            genres: [...prev.genres, existingGenre],
          }));
        }
        setNewGenre("");
      }
    }
  };

  const addNewDirector = () => {
    if (newDirector.trim()) {
      const directorExists = allDirectors.some((director) => director.name.toLowerCase() === newDirector.toLowerCase());
  
      if (!directorExists) {
        const newDirectorData = { id: allDirectors.length + 1, name: newDirector.trim() };
  
        setAllDirectors((prev) => [...prev, newDirectorData]);
  
        setNewMovie((prev) => ({
          ...prev,
          directors: [...prev.directors, newDirectorData],
        }));
      } else {
        const existingDirector = allDirectors.find((director) => director.name.toLowerCase() === newDirector.toLowerCase());
        if (existingDirector) {
          setNewMovie((prev) => ({
            ...prev,
            directors: [...prev.directors, existingDirector],
          }));
        }
      }
  
      setNewDirector("");
    }
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
            <div>
              <label className="block text-yellow-500 mb-2 text-sm">
                Жанри <span className="text-red-600">*</span>
              </label>
              <div className="mb-2">
              <select
  className="w-full p-3 bg-gray-800 text-white rounded"
  multiple
  value={newMovie.genres.map((genre) => genre.id.toString())} // Convert to string
  onChange={(e) => {
    const selectedGenreIds = Array.from(e.target.selectedOptions, (option) => parseInt(option.value)); // Отримуємо тільки id жанрів
    console.log("Selected genre IDs:", selectedGenreIds); // Логування вибраних id жанрів
    setNewMovie({ ...newMovie, genres: selectedGenreIds.map(id => ({ id })) }); // Форматування для збереження id
  }}
>
  {allGenres.map((genre) => (
    <option key={genre.id} value={genre.id.toString()}>
      {genre.name}
    </option>
  ))}
</select>
              </div>
              <input
                type="text"
                className="w-full p-3 bg-gray-800 text-white rounded"
                placeholder="Додати новий жанр"
                value={newGenre}
                onChange={(e) => setNewGenre(e.target.value)}
              />
              <button
                className="mt-2 p-2 bg-yellow-500 text-white rounded"
                type="button"
                onClick={addNewGenre}
              >
                Додати жанр
              </button>
            </div>

            <div>
              <label className="block text-yellow-500 mb-2 text-sm">
                Режисери <span className="text-red-600">*</span>
              </label>
              <div className="mb-2">
              <select
  className="w-full p-3 bg-gray-800 text-white rounded"
  multiple
  value={newMovie.directors.map((director) => director.id.toString())} // Convert to string
  onChange={(e) => {
    const selectedDirectorIds = Array.from(e.target.selectedOptions, (option) => parseInt(option.value)); // Отримуємо тільки id режисерів
    console.log("Selected director IDs:", selectedDirectorIds); // Логування вибраних id режисерів
    setNewMovie({ ...newMovie, directors: selectedDirectorIds.map(id => ({ id })) }); // Форматування для збереження id
  }}
>
  {allDirectors.map((director) => (
    <option key={director.id} value={director.id.toString()}>
      {director.name}
    </option>
  ))}
</select>
              </div>
              <input
                type="text"
                className="w-full p-3 bg-gray-800 text-white rounded"
                placeholder="Додати нового режисера"
                value={newDirector}
                onChange={(e) => setNewDirector(e.target.value)}
              />
              <button
                className="mt-2 p-2 bg-yellow-500 text-white rounded"
                type="button"
                onClick={addNewDirector}
              >
                Додати режисера
              </button>
            </div>
            <div className="w-full flex justify-center mt-4">
              <button
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-4 px-6 rounded"
                onClick={addMovie}
              >
                Додати фільм
              </button>
            </div>
          </div>
        </div>

        {/* Movies list */}
        <h2 className="text-xl font-bold text-yellow-600 mb-4">Список фільмів</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.map((movie) => (
            <div key={movie.id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="relative">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full h-72 object-cover"
                />
                <div className="absolute top-0 left-0 bg-black bg-opacity-50 text-white p-2">
                  <button
                    className="text-red-600"
                    onClick={() => removeMovie(movie.id)}
                  >
                    Видалити
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold">{movie.title}</h3>
                <p><strong>Мова:</strong> {movie.language}</p>
                <p><strong>Рейтинг:</strong> {movie.rating}</p>
                <p><strong>Тривалість:</strong> {movie.duration} хв</p>
                <p><strong>Жанри:</strong> {movie.genres && movie.genres.length > 0 ? movie.genres.map((genre) => genre.name).join(", ") : "Немає жанрів"}</p>
                <p><strong>Режисери:</strong> {movie.directors && movie.directors.length > 0 ? movie.directors.map((director) => director.name).join(", ") : "Немає режисерів"}</p>
                <div>
                  <button
                    className="text-yellow-500 mt-2"
                    onClick={() => toggleDescription(movie.id)}
                  >
                    {expanded[movie.id] ? "Згорнути" : "Читати більше"}
                  </button>
                  {expanded[movie.id] && (
                    <div className="mt-2">
                      <p><strong>Опис:</strong> {movie.description}</p>
                    </div>
                  )}
                </div>
                <button
                  className="mt-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => window.open(movie.trailerUrl, "_blank")}
                >
                  Переглянути трейлер
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoviesPage;
