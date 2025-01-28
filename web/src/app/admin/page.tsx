

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

const AdminMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [newMovie, setNewMovie] = useState({
    title: "",
    description: "",
    releaseDate: "",
    rating: 0,
    duration: 0,
    language: "",
    posterUrl: "",
    trailerUrl: "",
    genres: [] as Genre[],
    directors: [] as Director[],
  });

  
  useEffect(() => {
    fetch("/api/movies")  
      .then((response) => response.json())
      .then((data) => setMovies(data))
      .catch((error) => console.error("Error fetching movies:", error));
  }, []);

 
  const addMovie = () => {
    if (newMovie.title.trim()) {
      fetch("/api/movies", {  
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newMovie.title,
          description: newMovie.description,
          releaseDate: newMovie.releaseDate,
          rating: newMovie.rating,
          duration: newMovie.duration,
          language: newMovie.language,
          posterUrl: newMovie.posterUrl,
          trailerUrl: newMovie.trailerUrl,
          genres: newMovie.genres,
          directors: newMovie.directors,
        }),
      })
        .then((response) => response.json())
        .then((data) => setMovies([...movies, data]))  
        .catch((error) => console.error("Error adding movie:", error));

      
      setNewMovie({
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

  
  const removeMovie = (id: number) => {  
    fetch(`/api/movies/${id}`, { method: "DELETE" })  
      .then(() => setMovies(movies.filter((movie: Movie) => movie.id !== id)))  
      .catch((error) => console.error("Error deleting movie:", error));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-8xl mx-auto bg-gray-700 shadow-lg rounded-lg p-6 ">
      <h1 className="text-3xl font-bold text-yellow-600 text-center mb-6">
          Адмін-Панель - Кінотеатр
        </h1>



        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <input
            type="text"
            className="w-full p-3 bg-gray-800 text-white rounded"
            placeholder="Назва фільму"
            value={newMovie.title}
            onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
          />
          <textarea
            className="w-full p-3 bg-gray-800 text-white rounded"
            placeholder="Опис фільму"
            value={newMovie.description}
            onChange={(e) => setNewMovie({ ...newMovie, description: e.target.value })}
          />
          <input
            type="text"
            className="w-full p-3 bg-gray-800 text-white rounded"
            placeholder="Дата виходу"
            value={newMovie.releaseDate}
            onChange={(e) => setNewMovie({ ...newMovie, releaseDate: e.target.value })}
          />
          <input
            type="number"
            className="w-full p-3 bg-gray-800 text-white rounded"
            placeholder="Рейтинг"
            value={newMovie.rating}
            onChange={(e) => setNewMovie({ ...newMovie, rating: parseFloat(e.target.value) })}
          />
          <input
            type="number"
            className="w-full p-3 bg-gray-800 text-white rounded"
            placeholder="Тривалість (хв)"
            value={newMovie.duration}
            onChange={(e) => setNewMovie({ ...newMovie, duration: parseInt(e.target.value) })}
          />
          <input
            type="text"
            className="w-full p-3 bg-gray-800 text-white rounded"
            placeholder="Мова"
            value={newMovie.language}
            onChange={(e) => setNewMovie({ ...newMovie, language: e.target.value })}
          />
          <input
            type="text"
            className="w-full p-3 bg-gray-800 text-white rounded"
            placeholder="URL постера"
            value={newMovie.posterUrl}
            onChange={(e) => setNewMovie({ ...newMovie, posterUrl: e.target.value })}
          />
          <input
            type="text"
            className="w-full p-3 bg-gray-800 text-white rounded"
            placeholder="URL трейлера"
            value={newMovie.trailerUrl}
            onChange={(e) => setNewMovie({ ...newMovie, trailerUrl: e.target.value })}
          />

          
          <div className="col-span-2">
            <label className="text-white">Жанри:</label>
            <input
              type="text"
              className="w-full p-3 bg-gray-800 text-white rounded"
              placeholder="Жанр"
              onChange={(e) => {
                const newGenres = [
                  ...newMovie.genres,
                  { id: newMovie.genres.length + 1, name: e.target.value },
                ];
                setNewMovie({ ...newMovie, genres: newGenres });
              }}
            />
          </div>

          
          <div className="col-span-2">
            <label className="text-white">Режисери:</label>
            <input
              type="text"
              className="w-full p-3 bg-gray-800 text-white rounded"
              placeholder="Режисер"
              onChange={(e) => {
                const newDirectors = [
                  ...newMovie.directors,
                  { id: newMovie.directors.length + 1, name: e.target.value },
                ];
                setNewMovie({ ...newMovie, directors: newDirectors });
              }}
            />
          </div>

          <button
            className="col-span-2 mt-3 p-3 bg-yellow-600 text-black font-bold rounded hover:bg-yellow-400"
            onClick={addMovie}  
          >
            Додати Фільм
          </button>
        </div>



        <ul className="mt-6 space-y-3">
          {movies.map((movie) => (
            <li
              key={movie.id}
              className="flex justify-between bg-gray-800 p-3 rounded border border-gray-700"
            >
              <span className="text-lg">🎬 {movie.title}</span>
              <button
                className="bg-red-600 text-white p-1 rounded hover:bg-red-500"
                onClick={() => removeMovie(movie.id)} 
              >
                Видалити
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminMovies;