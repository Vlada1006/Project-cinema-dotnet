"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter

type Genre = {
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
  genres: Genre[]; // Change this to an array of Genre objects
}

const Genres = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [allMovies, setAllMovies] = useState<Movie[]>([]); // Store all movies
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch("/api/genres");
        const data = await response.json();
        setGenres(data.data || []);
      } catch (error) {
        console.error("Error loading genres:", error);
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
          genres: movie.genres || [], // Assuming genres are part of the movie data
        }));
        setMovies(fetchedMovies);
        setAllMovies(fetchedMovies); // Store all movies
      } catch (error) {
        console.error("Error loading movies:", error);
      }
    };

    fetchGenres();
    fetchMovies();
  }, []);

  useEffect(() => {
    if (selectedGenres.length > 0) {
      const filteredMovies = allMovies.filter((movie) =>
        selectedGenres.every((selectedGenre) =>
          movie.genres.some((genre) => genre.name === selectedGenre) // Check if all selected genres are present
        )
      );
      setMovies(filteredMovies);
    } else {
      setMovies(allMovies); // Reset to all movies if no genre is selected
    }
  }, [selectedGenres, allMovies]);

  const handleGenreChange = (genreName: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genreName)
        ? prev.filter((name) => name !== genreName) // Remove genre if already selected
        : [...prev, genreName] // Add genre if not selected
    );
  };

  const handleClearAll = () => {
    setSelectedGenres([]); // Clear all selected genres
  };

  const handleMovieClick = (id: string) => {
    router.push(`/movie/${id}`); // Navigate to the movie detail page
  };

  return (
    <div className="p-6 bg-gray-900 text-yellow-600 min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Жанри фільмів</h1>
      <div className="mb-4">
        <label className="block text-lg mb-2">Оберіть жанри:</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4"> {/* Grid layout for genres */}
          {genres.map((genre) => (
            <label key={genre.id} className="flex items-center">
              <input
                type="checkbox"
                value={genre.name}
                checked={selectedGenres.includes(genre.name)}
                onChange={() => handleGenreChange(genre.name)}
                className="mr-2"
              />
              {genre.name}
            </label>
          ))}
        </div>
        <button
          onClick={handleClearAll}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500"
        >
          Очистити все
        </button>
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
                Жанри: {movie.genres.map((g) => g.name).join(", ")}
              </p>
            </div>
          ))
        ) : (
          <p key="no-movies" className="text-gray-400">
            Оберіть жанри, щоб переглянути фільми.
          </p>
        )}
      </div>
    </div>
  );
};

export default Genres;