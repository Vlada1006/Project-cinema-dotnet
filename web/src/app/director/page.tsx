"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter

type Director = {
  id: number;
  name: string;
};

interface Movie {
  id: string;
  posterUrl: string;
  title: string;
  description: string;
  release_date: string;
  rating: number;
  directors: Director[]; // Assuming movies have an array of directors
}

const MoviesByDirectors = () => {
  const [directors, setDirectors] = useState<Director[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [allMovies, setAllMovies] = useState<Movie[]>([]); // Store all movies
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    const fetchDirectors = async () => {
      try {
        const response = await fetch("/api/directors"); // Fetch directors from the API
        const data = await response.json();
        setDirectors(data.data || []);
      } catch (error) {
        console.error("Error loading directors:", error);
      }
    };

    const fetchMovies = async () => {
      try {
        const response = await fetch("/api/movies");
        const data = await response.json();
        const fetchedMovies: Movie[] = data.data.map((movie: any) => ({
          id: movie.id.toString(),
          title: movie.title,
          posterUrl: movie.posterUrl.startsWith("https://")
            ? movie.posterUrl
            : `https://localhost:7000${movie.posterUrl}`,
          description: movie.description,
          release_date: movie.release_date,
          rating: movie.rating,
          directors: movie.directors || [],
        }));
        setMovies(fetchedMovies);
        setAllMovies(fetchedMovies); // Store all movies
      } catch (error) {
        console.error("Error loading movies:", error);
      }
    };

    fetchDirectors();
    fetchMovies();
  }, []);

  useEffect(() => {
    const filteredMovies = allMovies.filter((movie) =>
      movie.directors.some((director) =>
        director.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setMovies(filteredMovies);
  }, [searchTerm, allMovies]);

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handleMovieClick = (id: string) => {
    router.push(`/movie/${id}`); // Navigate to the movie detail page
  };

  return (
    <div className="p-6 bg-gray-900 text-yellow-600 min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Фільми за режисерами</h1>

      <div className="mb-4 flex items-center">
        <label className="block text-lg mb-2 mr-2">Пошук за режисерами:</label>
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Введіть ім'я режисера..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 bg-gray-800 rounded w-full"
          />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
              aria-label="Clear search"
            >
              &times; {/* This is the "X" character */}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div
              key={movie.id}
              onClick={() => handleMovieClick(movie.id)} // Add click handler
              className="bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-700 transition"
            >
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-64 object-cover rounded"
              />
              <h3 className="text-xl font-bold mt-2">{movie.title}</h3>
              <p className="text-sm text-gray-400">{movie.release_date}</p>
              <p className="mt-2">{movie.description.substring(0, 100)}...</p>
              <p className="mt-2 text-sm text-gray-400">
                Режисери: {movie.directors.map((d) => d.name).join(", ")}
              </p>
            </div>
          ))
        ) : (
          <p key="no-movies" className="text-gray-400">
            Немає фільмів, що відповідають вашому запиту.
          </p>
        )}
      </div>
    </div>
  );
};

export default MoviesByDirectors;