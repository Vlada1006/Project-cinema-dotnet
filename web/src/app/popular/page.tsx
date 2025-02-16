"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Movie {
  id: string;
  posterUrl: string;
  title: string;
  description: string;
  release_date: string;
  rating: number;
}

const PopularFilms = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  const router = useRouter();

  const handleMovieClick = (id: string) => {
    router.push(`/movie/${id}`);
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("/api/movies");
        if (!response.ok) {
          throw new Error("Помилка завантаження фільмів");
        }
        const data = await response.json();

        if (data.data && Array.isArray(data.data)) {
          const fetchedMovies: Movie[] = data.data.map((movie: any) => ({
            id: movie.id.toString(),
            title: movie.title,
            posterUrl: movie.posterUrl.startsWith("https://")
              ? movie.posterUrl
              : `https://localhost:7000${movie.posterUrl}`,
            description: movie.description,
            release_date: movie.release_date,
            rating: movie.rating,
          }));
          setMovies(fetchedMovies);
        } else {
          throw new Error("Невірний формат відповіді");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    if (movies.length > 0) {
      const sortedMovies = [...movies].sort((a, b) => {
        return sortOrder === "desc" ? b.rating - a.rating : a.rating - b.rating;
      });
      setMovies(sortedMovies);
    }
  }, [sortOrder]);

  const handleSortChange = (order: "desc" | "asc") => {
    setSortOrder(order);
  };

  if (loading) {
    return <p className="text-yellow-600 text-center mt-8">Завантаження...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center mt-8">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-yellow-600 p-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-center">Популярні фільми</h1>
        <div className="flex justify-center mt-4">
          <button
            onClick={() => handleSortChange("desc")}
            className="bg-yellow-600 text-black px-4 py-2 rounded mx-2"
          >
            За спаданням
          </button>
          <button
            onClick={() => handleSortChange("asc")}
            className="bg-yellow-600 text-black px-4 py-2 rounded mx-2"
          >
            За зростанням
          </button>
        </div>
      </header>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div
              key={movie.id}
              onClick={() => handleMovieClick(movie.id)}
              className="bg-gray-800 p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-700 transition"
            >
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-64 object-cover rounded"
              />
              <h2 className="text-2xl font-semibold mt-4">{movie.title}</h2>
              <p className="text-sm text-gray-400 mt-2">{movie.release_date}</p>
              <p className="mt-2">{movie.description.substring(0, 100)}...</p>
              <p className="mt-2 font-bold">Рейтинг: {movie.rating}/10</p>
            </div>
          ))
        ) : (
          <p className="text-center text-white mt-8">Фільми не знайдено</p>
        )}
      </section>
    </div>
  );
};

export default PopularFilms;
