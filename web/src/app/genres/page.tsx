"use client";

import React, { useState, useEffect, JSX } from "react";

type Genre = {
  id: number;
  name: string;
};
const Genres = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [movies, setMovies] = useState<any[]>([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch("/api/genres");
        const data = await response.json();
        console.log(data.data);
        setGenres(data.data || []);
      } catch (error) {
        console.error("Помилка завантаження жанрів:", error);
      }
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    if (selectedGenre) {
      fetchMoviesByGenre(selectedGenre);
    }
  }, [selectedGenre]);

  const fetchMoviesByGenre = async (genre: string) => {
    try {
      const response = await fetch("/api/movies");
      const { data } = await response.json();
      const filteredMovies = data.filter((movie: any) =>
        movie.description.includes(genre)
      );
      setMovies(filteredMovies || []);
    } catch (error) {
      console.error("Помилка завантаження фільмів:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-yellow-600 min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Жанри фільмів</h1>
      <div className="mb-4">
        <label className="block text-lg mb-2">Оберіть жанр:</label>
        <select
          className="p-2 bg-gray-800 rounded w-full"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          <option value="">Всі жанри</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.name}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {movies && movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie.id} className="bg-gray-800 p-4 rounded-lg">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-64 object-cover rounded"
              />
              <h3 className="text-xl font-bold mt-2">{movie.title}</h3>
              <p className="text-sm text-gray-400">{movie.release_date}</p>
              <p className="mt-2">{movie.description.substring(0, 100)}...</p>
            </div>
          ))
        ) : (
          <p key="no-movies" className="text-gray-400">
            Оберіть жанр, щоб переглянути фільми.
          </p>
        )}
      </div>
    </div>
  );
};

export default Genres;
